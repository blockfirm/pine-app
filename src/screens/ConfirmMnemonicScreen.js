import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import headerStyles from '../styles/headerStyles';
import { reset as navigateWithReset } from '../actions/navigate';
import * as settingsActions from '../actions/settings';
import { sync as syncWallet } from '../actions/bitcoin/wallet/sync';
import Paragraph from '../components/Paragraph';
import MnemonicInput from '../components/MnemonicInput';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

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
  },
  mnemonic: {
    marginTop: 10
  }
});

@connect()
export default class ConfirmMnemonicScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const params = navigation.state.params;
    const isModal = params ? params.isModal : false;
    const headerLeft = <BackButton onPress={() => { navigation.goBack(); }} />;

    return {
      title: 'Confirm Recovery Key',
      headerTransparent: true,
      headerStyle: headerStyles.whiteHeader,
      headerTitleStyle: headerStyles.title,
      headerLeft
    };
  };

  state = {
    phrase: '',
    keyboardState: false
  }

  _onKeyboardToggle(keyboardState) {
    this.setState({ keyboardState });
  }

  _showCreatePineAddressScreen() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('CreatePineAddress'));
  }

  _flagAsBackedUp() {
    const dispatch = this.props.dispatch;

    const newSettings = {
      user: {
        hasCreatedBackup: true,
        forceManualBackup: false
      }
    };

    return dispatch(settingsActions.save(newSettings));
  }

  _onConfirm() {
    const { dispatch, navigation } = this.props;
    const { isModal } = navigation.state.params;

    this._flagAsBackedUp();

    if (!isModal) {
      return dispatch(syncWallet()).then(() => {
        this._showCreatePineAddressScreen();
      });
    }

    this.props.screenProps.dismiss();
  }

  _onChangePhrase(phrase) {
    this.setState({ phrase });
  }

  _isPhraseCorrect() {
    const { params } = this.props.navigation.state;
    const correctPhrase = params.mnemonic;
    const phrase = this.state.phrase;
    const isComplete = phrase === correctPhrase;

    return isComplete;
  }

  render() {
    const { params } = this.props.navigation.state;
    const correctPhrase = params.mnemonic;
    const buttonDisabled = !this._isPhraseCorrect();
    const contentStyles = [styles.content];

    if (this.state.keyboardState) {
      contentStyles.push(styles.contentHidden);
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss.bind(Keyboard)}>
        <View style={styles.view}>
          <BaseScreen hideHeader={true}>
            <View style={contentStyles}>
              <Paragraph style={styles.paragraph}>
                To verify that you saved the words correctly,
                please enter them below.
              </Paragraph>
            </View>

            <View style={styles.mnemonic}>
              <MnemonicInput
                correctPhrase={correctPhrase}
                onChange={this._onChangePhrase.bind(this)}
              />
            </View>

            <Footer>
              <Button
                label='Confirm'
                disabled={buttonDisabled}
                fullWidth={this.state.keyboardState}
                onPress={this._onConfirm.bind(this)}
                showLoader={true}
                runAfterInteractions={true}
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

ConfirmMnemonicScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  screenProps: PropTypes.object
};
