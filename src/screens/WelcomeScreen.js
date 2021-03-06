import React, { Component } from 'react';
import { StyleSheet, StatusBar, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import iCloudAccountStatus from 'react-native-icloud-account-status';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import { reset as navigateWithReset } from '../actions/navigate';
import { handle as handleError } from '../actions/error';
import * as keyActions from '../actions/keys';
import * as settingsActions from '../actions/settings';
import { sync as syncWallet } from '../actions/bitcoin/wallet/sync';
import generateMnemonic from '../crypto/generateMnemonic';
import Footer from '../components/Footer';
import WhiteButton from '../components/WhiteButton';
import Link from '../components/Link';
import BaseScreen from './BaseScreen';

const illustration = require('../images/illustrations/Welcome.png');

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD23F'
  },
  illustration: {
    width: 168,
    height: 220,
    marginBottom: 150
  },
  footer: {
    backgroundColor: 'transparent',
    left: 0,
    right: 0
  },
  button: {
    width: null,
    paddingLeft: 50,
    paddingRight: 50
  },
  link: {
    marginTop: 30,
    marginBottom: ifIphoneX(0, 5)
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

  _showCreatePineAddressScreen() {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('CreatePineAddress'));
  }

  _showBackUpMnemonicScreen(mnemonic) {
    const dispatch = this.props.dispatch;
    return dispatch(navigateWithReset('Mnemonic', { mnemonic }));
  }

  _flagAsInitialized() {
    const dispatch = this.props.dispatch;

    const newSettings = {
      initialized: true
    };

    return dispatch(settingsActions.save(newSettings));
  }

  _forceManualBackup(mnemonic) {
    const dispatch = this.props.dispatch;

    const newSettings = {
      user: {
        forceManualBackup: true
      }
    };

    dispatch(settingsActions.save(newSettings));
    this._showBackUpMnemonicScreen(mnemonic);
  }

  _createAccount() {
    const { dispatch } = this.props;
    let mnemonic = null;

    return generateMnemonic()
      .then((newMnemonic) => {
        // Save mnemonic.
        mnemonic = newMnemonic;
        return dispatch(keyActions.add(mnemonic));
      })
      .then(() => {
        // Flag that the user has set up the app for the first time.
        return this._flagAsInitialized();
      })
      .then(() => {
        return iCloudAccountStatus.getStatus();
      })
      .then((iCloudStatus) => {
        if (iCloudStatus !== iCloudAccountStatus.STATUS_AVAILABLE) {
          // Force manual backup since iCloud is not available.
          return this._forceManualBackup(mnemonic);
        }

        return dispatch(syncWallet()).then(() => {
          this._showCreatePineAddressScreen();
        });
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _recoverAccount() {
    const { dispatch, navigation } = this.props;

    return dispatch(keyActions.getBackups()).then((backups) => {
      if (backups.length > 0) {
        navigation.navigate('Recover');
      } else {
        navigation.navigate('ImportMnemonic');
      }
    });
  }

  render() {
    return (
      <BaseScreen style={styles.view} hideHeader={true}>
        <StatusBar barStyle='dark-content' />

        <Image source={illustration} style={styles.illustration} />

        <Footer style={styles.footer}>
          <WhiteButton
            label='Create a new account'
            onPress={this._createAccount.bind(this)}
            style={styles.button}
            showLoader={true}
            runAfterInteractions={true}
          />

          <Link
            onPress={this._recoverAccount.bind(this)}
            style={styles.link}
            labelStyle={styles.linkLabel}
          >
            Recover existing account
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
