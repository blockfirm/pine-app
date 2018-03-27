import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Paragraph from '../components/Paragraph';
import MnemonicWords from '../components/MnemonicWords';
import Button from '../components/Button';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  mnemonic: {
    marginTop: 10,
    marginBottom: 40
  }
});

@connect()
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
      <BaseScreen>
        <Paragraph style={styles.text}>
          Write down and store this recovery key in a safe place so you can recover
          your key if you lose or break your phone.
        </Paragraph>

        <MnemonicWords phrase={mnemonic} style={styles.mnemonic} />

        <Footer>
          <Button
            label='I have saved these words'
            onPress={this._showConfirmMnemonicScreen.bind(this)}
            style={styles.button}
          />
        </Footer>
      </BaseScreen>
    );
  }
}

MnemonicScreen.propTypes = {
  navigation: PropTypes.any
};
