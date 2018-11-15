import React, { Component } from 'react';
import { AppState, NetInfo } from 'react-native';
import { Provider } from 'react-redux';

import { sync as syncWallet } from './actions/bitcoin/wallet';
import * as internetActions from './actions/network/internet';
import AppNavigator from './navigators/AppNavigator';
import getAppWithNavigationState from './getAppWithNavigationState';
import createStore from './createStore';

const navReducer = (state, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
};

const store = createStore(navReducer);
const AppWithNavigationState = getAppWithNavigationState();

export default class App extends Component {
  constructor() {
    super(...arguments);

    this._onAppStateChange = this._onAppStateChange.bind(this);
    this._onConnectionChange = this._onConnectionChange.bind(this);
  }

  componentDidMount() {
    this._isConnectedToInternet = null;

    // Get initial app state.
    this._appState = AppState.currentState;

    // Listen for app state changes (e.g. when app becomes active).
    AppState.addEventListener('change', this._onAppStateChange);

    // Listen for internet connection changes.
    NetInfo.isConnected.addEventListener('connectionChange', this._onConnectionChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._onAppStateChange);
    NetInfo.isConnected.removeEventListener('connectionChange', this._onConnectionChange);
  }

  _updateInternetConnectionStatus() {
    NetInfo.isConnected.fetch().then(this._onConnectionChange);
  }

  _onAppStateChange(nextAppState) {
    if (this._appState.match(/inactive|background/) && nextAppState === 'active') {
      // The app has come to the foreground.
      this._updateInternetConnectionStatus();
    }

    this._appState = nextAppState;
  }

  _onConnectionChange(isConnected) {
    if (isConnected) {
      store.dispatch(internetActions.connected());

      if (this._isConnectedToInternet !== null) {
        this._syncWallet();
      }
    } else {
      store.dispatch(internetActions.disconnected());
    }

    this._isConnectedToInternet = isConnected;
  }

  _syncWallet() {
    const state = store.getState();

    if (state.settings.initialized) {
      store.dispatch(syncWallet());
    }
  }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
