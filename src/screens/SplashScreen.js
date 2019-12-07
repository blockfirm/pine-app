import React, { Component } from 'react';
import { StyleSheet, Image, ActivityIndicator, StatusBar, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { load as loadState, sync as syncApp, ready as onReady } from '../actions';
import { handle as handleError } from '../actions/error';
import { reset as navigateWithReset } from '../actions/navigate';
import { get as getFiatRates } from '../actions/bitcoin/fiatRates';
import getMnemonicByKey from '../crypto/getMnemonicByKey';
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

  componentDidMount() {
    const { dispatch } = this.props;

    // Load state, including settings, keys, and wallet data.
    dispatch(loadState())
      .then((state) => {
        // Get initial fiat exchange rates asynchronously.
        dispatch(getFiatRates());

        if (!state.settings.initialized) {
          return this._showWelcomeScreen();
        }

        if (state.settings.user.forceManualBackup && !state.settings.user.hasCreatedBackup) {
          return this._getMnemonicFromState(state).then((mnemonic) => {
            return this._showBackUpMnemonicScreen(mnemonic);
          });
        }

        // Show the create pine address screen if pine address is missing.
        if (!state.settings.user.profile.address) {
          return this._showCreatePineAddressScreen();
        }

        // Show the disclaimer screen if the terms and conditions hasn't been accepted.
        if (!state.settings.user.hasAcceptedTerms) {
          return this._showDisclaimerScreen();
        }

        setTimeout(() => {
          InteractionManager.runAfterInteractions(() => {
            const syncProfiles = true;

            dispatch(syncApp({ syncProfiles })).then(() => {
              dispatch(onReady());
            });
          });
        }, 250);

        this._showHomeScreen();
      })
      .then(() => {
        this._showStatusBar();
      })
      .catch((error) => {
        /**
         * If the mnemonic couldn't be found, it probably means that the phone
         * was reset from a backup containing all data except the keychain.
         * Reset the app and let the user recover from manual or iCloud backup.
         */
        if (error.message.includes('mnemonic')) {
          return this._reset();
        }

        dispatch(handleError(error));
      });
  }

  _reset() {
    const { dispatch } = this.props;
    const keepSettings = false;
    const keepBackup = true;

    return dispatch(navigateWithReset('Reset', { keepSettings, keepBackup }));
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
    dispatch(navigateWithReset('HomeAnimation'));
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

  render() {
    return (
      <BaseScreen style={styles.view}>
        <Image source={{ uri: 'LaunchScreenLogo' }} style={styles.logo} />
        <Footer style={styles.footer}>
          <ActivityIndicator color='#FFFFFF' style={styles.loader} size='small' />
        </Footer>
      </BaseScreen>
    );
  }
}

SplashScreen.propTypes = {
  dispatch: PropTypes.func
};
