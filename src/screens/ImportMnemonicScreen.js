import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import KeepAwake from 'react-native-keep-awake';
import * as bip39 from 'bip39';

import { reset as resetApp } from '../actions';
import { reset as navigateWithReset } from '../actions/navigate';
import { handle as handleError } from '../actions/error/handle';
import * as keyActions from '../actions/keys';
import * as settingsActions from '../actions/settings';
import * as bitcoinWalletActions from '../actions/bitcoin/wallet';
import { getById as getUserById } from '../clients/paymentServer/user';
import { getAccountKeyPairFromMnemonic, getUserIdFromPublicKey } from '../clients/paymentServer/crypto';
import { headerStyles } from '../styles';
import ChangeServerHeaderButtonContainer from '../containers/buttons/ChangeServerHeaderButtonContainer';
import HeaderBackground from '../components/HeaderBackground';
import HeaderTitle from '../components/HeaderTitle';
import BackButton from '../components/BackButton';
import Paragraph from '../components/Paragraph';
import MnemonicInput from '../components/MnemonicInput';
import Button from '../components/Button';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const WORD_LIST = bip39.wordlists.english;

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  content: {
    position: 'absolute',
    top: ifIphoneX(140, 100),
    alignItems: 'center',
    opacity: 1
  },
  contentHidden: {
    height: 0,
    opacity: 0
  },
  paragraph: {
    textAlign: 'center'
  }
});

@connect((state) => ({
  settings: state.settings
}))
export default class ImportMnemonicScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <HeaderBackground />,
    headerTitle: <HeaderTitle title='Enter Recovery Key' />,
    headerStyle: headerStyles.borderlessHeader,
    headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />,
    headerRight: <ChangeServerHeaderButtonContainer />
  });

  state = {
    phrase: '',
    loading: false,
    keyboardState: false
  }

  componentWillUnmount() {
    KeepAwake.deactivate();
  }

  _getPineHostname() {
    const { pineAddressHostname, defaultPineAddressHostname } = this.props.settings;
    return pineAddressHostname || defaultPineAddressHostname;
  }

  _onKeyboardToggle(keyboardState) {
    this.setState({ keyboardState });
  }

  _showCreatePineAddressScreen() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('CreatePineAddress'));
  }

  _showDisclaimerScreen() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('Disclaimer'));
  }

  _flagAsInitialized() {
    const dispatch = this.props.dispatch;

    const newSettings = {
      initialized: true,
      user: {
        hasCreatedBackup: true
      }
    };

    return dispatch(settingsActions.save(newSettings));
  }

  _importMnemonic() {
    const dispatch = this.props.dispatch;
    const mnemonic = this.state.phrase;
    const hostname = this._getPineHostname();

    this.setState({ loading: true });
    KeepAwake.activate();

    // Wait 300ms for the keyboard to animate away.
    return new Promise(resolve => setTimeout(resolve, 300))
      .then(() => {
        const keepSettings = true;
        const keepBackup = true;

        // Reset the app in case the last recovery failed.
        return dispatch(resetApp(keepSettings, keepBackup));
      })
      .then(() => {
        // Try to recover a Pine user for the mnemonic.
        const keyPair = getAccountKeyPairFromMnemonic(mnemonic);
        const userId = getUserIdFromPublicKey(keyPair.publicKey);

        return getUserById(userId, hostname)
          .catch(() => {})
          .then((user) => {
            if (user) {
              // A Pine user was found for the mnemonic, save it to settings.
              const pineAddress = `${user.username}@${hostname}`;
              dispatch(settingsActions.saveUserProfile(pineAddress, user));
            }

            return user;
          });
      })
      .then((user) => {
        if (!user) {
          this.setState({ loading: false });
          KeepAwake.deactivate();

          return Alert.alert(
            'No Account Found',
            'No Pine account was found for the entered recovery key. Please make sure that you entered it correctly.',
            [{ text: 'OK', style: 'cancel' }],
            { cancelable: false }
          );
        }

        // Save key.
        return dispatch(keyActions.add(mnemonic))
          .then(() => {
            // Sync wallet with the bitcoin blockchain for the first time.
            return dispatch(bitcoinWalletActions.init());
          })
          .then(() => {
            this._flagAsInitialized();
            return this._showDisclaimerScreen();
          });
      })
      .catch((error) => {
        dispatch(handleError(error));
        this.setState({ loading: false });
        KeepAwake.deactivate();
      });
  }

  _isPhraseComplete() {
    const phrase = this.state.phrase.trim();
    const words = phrase.split(' ');
    const isComplete = words.every((word) => WORD_LIST.includes(word));

    return words.length === 12 && isComplete;
  }

  render() {
    const buttonDisabled = !this._isPhraseComplete();
    const contentStyles = [styles.content];

    if (this.state.keyboardState) {
      contentStyles.push(styles.contentHidden);
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss.bind(Keyboard)}>
        <View style={styles.view}>
          <BaseScreen hideHeader={true}>
            <StatusBar barStyle='default' />

            <View style={contentStyles}>
              <Paragraph style={styles.paragraph}>
                Enter your recovery key to recover an existing account.
              </Paragraph>
            </View>

            <View>
              <MnemonicInput
                onChange={(phrase) => this.setState({ phrase })}
                wordList={WORD_LIST}
                disabled={this.state.loading}
              />
            </View>

            <Footer>
              <Button
                label='Recover'
                disabled={buttonDisabled}
                fullWidth={this.state.keyboardState}
                onPress={this._importMnemonic.bind(this)}
                showLoader={true}
                runAfterInteractions={true}
                hapticFeedback={true}
              />
              <KeyboardSpacer topSpacing={-30} onToggle={this._onKeyboardToggle.bind(this)} />
            </Footer>

            <KeyboardSpacer onToggle={this._onKeyboardToggle.bind(this)} />
          </BaseScreen>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

ImportMnemonicScreen.propTypes = {
  dispatch: PropTypes.func,
  settings: PropTypes.object
};
