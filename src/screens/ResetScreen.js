import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { reset as resetApp } from '../actions';
import { handle as handleError } from '../actions/error';
import { reset as navigateWithReset } from '../actions/navigate';
import BaseScreen from './BaseScreen';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  loader: {
    height: 42
  }
});

@connect()
export default class ResetScreen extends Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    /**
     * Wait a second before resetting to be sure that all other screens
     * have been unmounted. Otherwise the app might crash due to the
     * state changing too much at once. It also prevents flickering.
     */
    setTimeout(() => {
      this._reset();
    }, 1000);
  }

  _reset() {
    const { dispatch, navigation } = this.props;
    const { keepSettings, keepBackup } = navigation.state.params;

    return dispatch(resetApp(keepSettings, keepBackup))
      .then(() => {
        InteractionManager.runAfterInteractions(() => {
          this._showSplashScreen();
        });
      })
      .catch((error) => {
        dispatch(handleError(error));
        this._showHomeScreen();
      });
  }

  _showHomeScreen() {
    const { dispatch } = this.props;
    dispatch(navigateWithReset('Home'));
  }

  _showSplashScreen() {
    const { dispatch } = this.props;
    dispatch(navigateWithReset('Splash'));
  }

  render() {
    return (
      <BaseScreen style={styles.view}>
        <ActivityIndicator color='gray' style={styles.loader} size='small' />
      </BaseScreen>
    );
  }
}

ResetScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
