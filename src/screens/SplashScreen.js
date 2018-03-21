import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateWithReset } from '../actions';
import * as settingsActions from '../actions/settings';
import Footer from '../components/Footer';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
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

    if (!settings.initialized) {
      return this._showWelcomeView();
    }

    this._showHomeView();
  }

  _showHomeView() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Home'));
  }

  _showWelcomeView() {
    const dispatch = this.props.dispatch;
    dispatch(navigateWithReset('Welcome'));
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <Footer style={styles.footer}>
          <ActivityIndicator animating={true} color='#797F89' style={styles.loader} size='small' />
        </Footer>
      </BaseScreen>
    );
  }
}

SplashScreen.propTypes = {
  dispatch: PropTypes.func
};
