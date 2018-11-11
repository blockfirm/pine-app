import React, { Component } from 'react';
import { NetInfo } from 'react-native';
import { Provider } from 'react-redux';

import { sync as syncWallet } from './actions/bitcoin/wallet';
import * as internetActions from './actions/network/internet';
import AppNavigator from './AppNavigator';
import getAppWithNavigationState from './getAppWithNavigationState';
import createStore from './createStore';

const navReducer = (state, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
};

const store = createStore(navReducer);
const AppWithNavigationState = getAppWithNavigationState();

export default class App extends Component {
  componentDidMount() {
    // Get initial internet connection status.
    NetInfo.isConnected.fetch().then(this._onConnectionChange.bind(this));

    // Listen for internet connection changes.
    NetInfo.isConnected.addEventListener('connectionChange', this._onConnectionChange.bind(this));
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._onConnectionChange);
  }

  _onConnectionChange(isConnected) {
    if (isConnected) {
      store.dispatch(internetActions.connected());
      store.dispatch(syncWallet());
    } else {
      store.dispatch(internetActions.disconnected());
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
