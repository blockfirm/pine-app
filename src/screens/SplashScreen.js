import React, { Component } from 'react';
import { StyleSheet, Image, ActivityIndicator, StatusBar, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { load as loadState, sync as syncApp, ready as onReady } from '../actions';
import { reset as navigateWithReset } from '../actions/navigate';
import { updateProfiles as updateContactProfiles } from '../actions/contacts';
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
            dispatch(syncApp()).then(() => {
              dispatch(updateContactProfiles());
              dispatch(onReady());
            });
          });
        }, 250);

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
