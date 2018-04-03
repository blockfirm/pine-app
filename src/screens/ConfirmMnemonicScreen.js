import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { navigateWithReset } from '../actions';
import { handle as handleError } from '../actions/error/handle';
import * as keyActions from '../actions/keys';
import * as settingsActions from '../actions/settings';
import saveMnemonicByKey from '../crypto/saveMnemonicByKey';
import getPublicKeyFromMnemonic from '../crypto/getPublicKeyFromMnemonic';
import Title from '../components/Title';
import Paragraph from '../components/Paragraph';
import MnemonicInput from '../components/MnemonicInput';
import Button from '../components/Button';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  content: {
    alignItems: 'center',
    opacity: 1
  },
  contentHidden: {
    height: 0,
    opacity: 0
  },
  text: {
    marginBottom: 30
  }
});

@connect()
export default class ConfirmMnemonicScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    phrase: '',
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

  _saveKey() {
    const dispatch = this.props.dispatch;
    const { params } = this.props.navigation.state;
    const mnemonic = params.mnemonic;
    const publicKey = getPublicKeyFromMnemonic(mnemonic);

    const key = {
      name: 'Default',
      xpub: publicKey
    };

    // Save key metadata with public key.
    return dispatch(keyActions.add(key))
      .then(() => {
        return dispatch(keyActions.save());
      })
      .then(() => {
        // Save mnemonic separately in Keychain.
        return saveMnemonicByKey(mnemonic, key.id);
      })
      .then(() => {
        // Flag that the user has set up the app for the first time.
        return this._flagAsInitialized();
      })
      .then(() => {
        return this._showDisclaimerScreen();
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
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
          <BaseScreen>
            <View style={contentStyles}>
              <Title>
                Confirm Recovery Key
              </Title>

              <Paragraph style={styles.text}>
                To verify that you saved the words correctly,
                please enter them below.
              </Paragraph>
            </View>

            <View>
              <MnemonicInput
                correctPhrase={correctPhrase}
                onChange={this._onChangePhrase.bind(this)}
              />
            </View>

            <Footer>
              <Button
                label='Confirm'
                loadingLabel='Saving key...'
                disabled={buttonDisabled}
                fullWidth={this.state.keyboardState}
                onPress={this._saveKey.bind(this)}
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
  navigation: PropTypes.any
};
