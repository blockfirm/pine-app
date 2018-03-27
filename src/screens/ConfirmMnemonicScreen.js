import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { navigateWithReset } from '../actions';
import * as keyActions from '../actions/keys';
import saveMnemonicByKey from '../crypto/saveMnemonicByKey';
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

  _showHomeScreen() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('Home'));
  }

  _saveKey() {
    const dispatch = this.props.dispatch;
    const { params } = this.props.navigation.state;
    const mnemonic = params.mnemonic;

    const key = {
      name: 'Default'
    };

    return dispatch(keyActions.add(key))
      .then(() => {
        return dispatch(keyActions.save());
      })
      .then(() => {
        return saveMnemonicByKey(mnemonic, key.id);
      })
      .then(() => {
        return this._showHomeScreen();
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
                Confirm recovery key
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
