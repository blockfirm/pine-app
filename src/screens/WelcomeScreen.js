import React, { Component } from 'react';
import { StyleSheet, StatusBar, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { handle as handleError } from '../actions/error';
import generateMnemonic from '../crypto/generateMnemonic';
import Footer from '../components/Footer';
import WhiteButton from '../components/WhiteButton';
import Link from '../components/Link';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD23F'
  },
  logo: {
    width: 93,
    height: 84,
    marginBottom: 150
  },
  footer: {
    backgroundColor: 'transparent'
  },
  button: {
    width: null,
    paddingLeft: 50,
    paddingRight: 50
  },
  link: {
    marginTop: 30,
    marginBottom: 10
  },
  linkLabel: {
    color: 'white'
  }
});

@connect()
export default class WelcomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  _showMnemonicScreen(mnemonic) {
    const navigation = this.props.navigation;
    navigation.navigate('Mnemonic', { mnemonic });
  }

  _createWallet() {
    const dispatch = this.props.dispatch;

    return generateMnemonic()
      .then((mnemonic) => {
        this._showMnemonicScreen(mnemonic);
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _importWallet() {
    const navigation = this.props.navigation;
    navigation.navigate('ImportMnemonic');
  }

  render() {
    return (
      <BaseScreen style={styles.view} hideHeader={true}>
        <StatusBar barStyle='light-content' />

        <Image source={{ uri: 'LaunchScreenLogo' }} style={styles.logo} />

        <Footer style={styles.footer}>
          <WhiteButton
            label='Create a new wallet'
            onPress={this._createWallet.bind(this)}
            style={styles.button}
          />

          <Link
            onPress={this._importWallet.bind(this)}
            style={styles.link}
            labelStyle={styles.linkLabel}
          >
            Recover existing wallet
          </Link>
        </Footer>
      </BaseScreen>
    );
  }
}

WelcomeScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
