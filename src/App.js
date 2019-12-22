import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';

import { handle as handleError } from './actions/error';
import AppNavigator from './navigators/AppNavigator';
import ServiceManager from './services/ServiceManager';
import { ThemeProvider } from './contexts/theme';
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
    this._services = new ServiceManager(store);
  }

  componentDidMount() {
    try {
      this._services.start();
    } catch (error) {
      store.dispatch(handleError(error));
    }
  }

  componentWillUnmount() {
    this._services.stop();
  }

  render() {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
            <AppWithNavigationState />
          </View>
        </ThemeProvider>
      </Provider>
    );
  }
}
