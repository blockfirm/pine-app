import React, { Component } from 'react';
import { StyleSheet, StatusBar, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateWithReset } from '../actions';
import { handle as handleError } from '../actions/error';
import * as keyActions from '../actions/keys';
import * as settingsActions from '../actions/settings';
import { getUnused as getUnusedAddress } from '../actions/bitcoin/wallet/addresses';
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

  _createWallet() {
    const dispatch = this.props.dispatch;

    return generateMnemonic()
      .then((mnemonic) => {
        // Back up mnemonic in iCloud.
        return dispatch(keyActions.backup(mnemonic)).then(() => mnemonic);
      })
      .then((mnemonic) => {
        // Save key.
        return dispatch(keyActions.add(mnemonic));
      })
      .then(() => {
        // Flag that the user has set up the app for the first time.
        return this._flagAsInitialized();
      })
      .then(() => {
        // Load an unused address into state.
        return Promise.all([
          dispatch(getUnusedAddress()), // External address.
          dispatch(getUnusedAddress(true)) // Internal address.
        ]);
      })
      .then(() => {
        this._showDisclaimerScreen();
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
            showLoader={true}
            hapticFeedback={true}
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
