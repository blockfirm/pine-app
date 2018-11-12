import React, { Component } from 'react';
import { StyleSheet, Image, ActivityIndicator, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateWithReset, load as loadState } from '../actions';
import * as walletActions from '../actions/bitcoin/wallet';
import * as keyActions from '../actions/keys';
import * as settingsActions from '../actions/settings';
import Footer from '../components/Footer';
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
    height: 84
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
        if (!state.settings.initialized) {
          return this._initialize();
        }

        // Show the disclaimer screen if the terms and conditions hasn't been accepted.
        if (!state.settings.user.hasAcceptedTerms) {
          return this._showDisclaimerScreen();
        }

        // Sync wallet in background and show Home screen.
        dispatch(walletActions.sync());
        this._showHomeScreen();
      })
      .then(() => {
        this._showStatusBar();
      });
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
          return true;
        });
    });
  }

  _initialize() {
    /**
     * Try to recover from iCloud or show the welcome screen
     * if the wallet hasn't been set up.
     */
    return this._tryRecover().then((recovered) => {
      if (recovered) {
        return this._showDisclaimerScreen();
      }

      this._showWelcomeScreen();
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
