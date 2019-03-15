import React, { Component } from 'react';
import { StyleSheet, StatusBar, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import iCloudAccountStatus from 'react-native-icloud-account-status';

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

  _createWallet() {
    const dispatch = this.props.dispatch;
    let mnemonic = null;
    let isBackedUpInICloud = false;

    return generateMnemonic()
      .then((newMnemonic) => {
        mnemonic = newMnemonic;

        return iCloudAccountStatus.getStatus().then((accountStatus) => {
          if (accountStatus === iCloudAccountStatus.STATUS_AVAILABLE) {
            // Back up mnemonic in iCloud.
            isBackedUpInICloud = true;
            return dispatch(keyActions.backup(mnemonic));
          }
        });
      })
      .then(() => {
        // Save mnemonic.
        return dispatch(keyActions.add(mnemonic));
      })
      .then(() => {
        // Flag that the user has set up the app for the first time.
        return this._flagAsInitialized();
      })
      .then(() => {
        if (!isBackedUpInICloud) {
          // Force manual backup if iCloud is not available.
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

  _importWallet() {
    const navigation = this.props.navigation;
    navigation.navigate('ImportMnemonic');
  }

  render() {
    return (
      <BaseScreen style={styles.view} hideHeader={true}>
        <StatusBar barStyle='dark-content' />

        <Image source={illustration} style={styles.illustration} />

        <Footer style={styles.footer}>
          <WhiteButton
            label='Create a new account'
            onPress={this._createWallet.bind(this)}
            style={styles.button}
            showLoader={true}
            runAfterInteractions={true}
            hapticFeedback={true}
          />

          <Link
            onPress={this._importWallet.bind(this)}
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
