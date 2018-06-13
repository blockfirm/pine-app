import React, { Component } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import MnemonicWordsContainer from '../containers/MnemonicWordsContainer';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  mnemonic: {
    marginTop: 10,
    marginBottom: 10
  },
  paragraph: {
    textAlign: 'center',
    position: 'absolute',
    top: ifIphoneX(140, 85)
  }
});

@connect((state) => ({
  recoveryKeyRevealed: state.recoveryKey.visible
}))
export default class MnemonicScreen extends Component {
  static navigationOptions = {
    header: null
  }

  _showConfirmMnemonicScreen() {
    const navigation = this.props.navigation;
    const { params } = navigation.state;
    const mnemonic = params.mnemonic;

    navigation.navigate('ConfirmMnemonic', { mnemonic });
  }

  render() {
    const { params } = this.props.navigation.state;
    const mnemonic = params.mnemonic;

    return (
      <BaseScreen headerTitle='Your Recovery Key'>
        <StatusBar barStyle='dark-content' />

        <Paragraph style={styles.paragraph}>
          Write down and store this recovery key in a safe place so you can recover
          your wallet if you lose or break your phone.
        </Paragraph>

        <MnemonicWordsContainer phrase={mnemonic} style={styles.mnemonic} />

        <Footer>
          <Button
            label='I have saved these words'
            onPress={this._showConfirmMnemonicScreen.bind(this)}
            style={styles.button}
            disabled={!this.props.recoveryKeyRevealed}
          />
        </Footer>
      </BaseScreen>
    );
  }
}

MnemonicScreen.propTypes = {
  navigation: PropTypes.any,
  recoveryKeyRevealed: PropTypes.bool
};
