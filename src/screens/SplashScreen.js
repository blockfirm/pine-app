import React, { Component } from 'react';
import { StyleSheet, Image, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateWithReset } from '../actions';
import * as settingsActions from '../actions/settings';
import * as keyActions from '../actions/keys';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#26203D'
  },
  logo: {
    width: 104,
    height: 75
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
    super(...arguments);

    const dispatch = props.dispatch;
    const settings = dispatch(settingsActions.load());

    this._loadState().then(() => {
      if (!settings.initialized) {
        return this._showWelcomeScreen();
      }

      this._showHomeScreen();
    });
  }

  _loadState() {
    const dispatch = this.props.dispatch;

    // Load existing keys into state.
    return dispatch(keyActions.load());
  }

  _showHomeScreen() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Home'));
  }

  _showWelcomeScreen() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Welcome'));
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <Image source={{ uri: 'LaunchScreenLogo' }} style={styles.logo} />
        <Footer style={styles.footer}>
          <ActivityIndicator animating={true} color='#D2DCFF' style={styles.loader} size='small' />
        </Footer>
      </BaseScreen>
    );
  }
}

SplashScreen.propTypes = {
  dispatch: PropTypes.func
};
