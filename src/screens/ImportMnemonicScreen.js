import React, { Component } from 'react';
import { StyleSheet, StatusBar, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import bip39 from 'bip39';

import { navigateWithReset } from '../actions';
import { handle as handleError } from '../actions/error/handle';
import * as keyActions from '../actions/keys';
import * as settingsActions from '../actions/settings';
import * as bitcoinWalletActions from '../actions/bitcoin/wallet';
import saveMnemonicByKey from '../crypto/saveMnemonicByKey';
import getPublicKeyFromMnemonic from '../crypto/getPublicKeyFromMnemonic';
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

@connect()
export default class ImportMnemonicScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    phrase: '',
    loading: false,
    keyboardState: false
  }

  _onKeyboardToggle(keyboardState) {
    this.setState({ keyboardState });
  }

  _showDisclaimerScreen() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('Disclaimer'));
  }

  _flagAsInitialized() {
    const dispatch = this.props.dispatch;

    const newSettings = {
      initialized: true
    };

    return dispatch(settingsActions.save(newSettings));
  }

  _importMnemonic() {
    const dispatch = this.props.dispatch;
    const mnemonic = this.state.phrase;
    const publicKey = getPublicKeyFromMnemonic(mnemonic);

    const key = {
      name: 'Default',
      xpub: publicKey
    };

    this.setState({ loading: true });

    // Save key metadata with public key.
    return dispatch(keyActions.add(key))
      .then(() => {
        // Save mnemonic separately in Keychain.
        return saveMnemonicByKey(mnemonic, key.id);
      })
      .then(() => {
        // Flag that the user has set up the app for the first time.
        return this._flagAsInitialized();
      })
      .then(() => {
        // Sync wallet with the bitcoin blockchain for the first time.
        return dispatch(bitcoinWalletActions.init());
      })
      .then(() => {
        return this._showDisclaimerScreen();
      })
      .catch((error) => {
        dispatch(handleError(error));
        this.setState({ loading: false });
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
          <BaseScreen headerTitle='Recover Wallet'>
            <StatusBar barStyle='dark-content' />

            <View style={contentStyles}>
              <Paragraph style={styles.paragraph}>
                Enter your recovery key to recover an existing wallet.
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
  dispatch: PropTypes.func
};
