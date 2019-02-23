import React, { Component } from 'react';
import { StyleSheet, Image, ActivityIndicator, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateWithReset, load as loadState, sync as syncApp } from '../actions';
import * as walletActions from '../actions/bitcoin/wallet';
import { get as getFiatRates } from '../actions/bitcoin/fiatRates';
import * as keyActions from '../actions/keys';
import * as settingsActions from '../actions/settings';
import getMnemonicByKey from '../crypto/getMnemonicByKey';
import { getById as getUserById } from '../PinePaymentProtocol/user';
import { getKeyPairFromMnemonic, getUserIdFromPublicKey } from '../PinePaymentProtocol/crypto';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD200'
  },
  logo: {
    width: 128,
    height: 57
  },
  footer: {
    backgroundColor: 'transparent'
  },
  loader: {
    height: 42
  }
});

@connect()
export default class SplashScreen extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    const dispatch = props.dispatch;

    super(...arguments);

    // Load state, including settings, keys, and wallet data.
    dispatch(loadState())
      .then((state) => {
        // Get initial fiat exchange rates asynchronously.
        dispatch(getFiatRates());

        if (!state.settings.initialized) {
          return this._initialize(state);
        }

        if (state.settings.user.forceManualBackup && !state.settings.user.hasCreatedBackup) {
          return this._getMnemonicFromState(state).then((mnemonic) => {
            return this._showBackUpMnemonicScreen(mnemonic);
          });
        }

        // Show the create pine address screen if pine address is missing.
        if (!state.settings.user.profile.pineAddress) {
          return this._showCreatePineAddressScreen();
        }

        // Show the disclaimer screen if the terms and conditions hasn't been accepted.
        if (!state.settings.user.hasAcceptedTerms) {
          return this._showDisclaimerScreen();
        }

        // Sync app in background and show Home screen.
        dispatch(syncApp());

        this._showHomeScreen();
      })
      .then(() => {
        this._showStatusBar();
      });
  }

  _getMnemonicFromState(state) {
    const keys = Object.values(state.keys.items);
    const defaultKey = keys[0];

    return getMnemonicByKey(defaultKey.id);
  }

  _showStatusBar() {
    StatusBar.setHidden(false, 'fade');
  }

  _showHomeScreen() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Home'));
  }

  _showWelcomeScreen() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Welcome'));
  }

  _showDisclaimerScreen() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Disclaimer'));
  }

  _showCreatePineAddressScreen() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('CreatePineAddress'));
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

  _tryRecover() {
    const dispatch = this.props.dispatch;

    return dispatch(keyActions.recover()).then((mnemonic) => {
      if (!mnemonic) {
        return;
      }

      return dispatch(keyActions.add(mnemonic))
        .then(() => {
          // Reset the wallet in case the last init didn't finish.
          return dispatch(walletActions.reset());
        })
        .then(() => {
          return dispatch(walletActions.init());
        })
        .then(() => {
          this._flagAsInitialized();
          return mnemonic;
        });
    });
  }

  _tryRecoverUser(mnemonic, defaultPineAddressHostname) {
    // Try to recover a Pine user for the mnemonic.
    const dispatch = this.props.dispatch;
    const keyPair = getKeyPairFromMnemonic(mnemonic);
    const userId = getUserIdFromPublicKey(keyPair.publicKey);

    return getUserById(userId, defaultPineAddressHostname)
      .catch(() => {})
      .then((user) => {
        if (user) {
          // A Pine user was found for the mnemonic, save it to settings.
          const pineAddress = `${user.username}@${defaultPineAddressHostname}`;
          dispatch(settingsActions.saveUserProfile(pineAddress, user));
        }

        return user;
      });
  }

  _initialize(state) {
    const { defaultPineAddressHostname } = state.settings;

    /**
     * Try to recover from iCloud or show the welcome screen
     * if the wallet hasn't been set up.
     */
    return this._tryRecover().then((mnemonic) => {
      if (!mnemonic) {
        return this._showWelcomeScreen();
      }

      return this._tryRecoverUser(mnemonic, defaultPineAddressHostname).then((user) => {
        if (!user) {
          // No Pine user was found for the mnemonic, ask user to create one.
          return this._showCreatePineAddressScreen();
        }

        return this._showDisclaimerScreen();
      });
    });
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <Image source={{ uri: 'LaunchScreenLogo' }} style={styles.logo} />
        <Footer style={styles.footer}>
          <ActivityIndicator animating={true} color='#FFFFFF' style={styles.loader} size='small' />
        </Footer>
      </BaseScreen>
    );
  }
}

SplashScreen.propTypes = {
  dispatch: PropTypes.func
};
