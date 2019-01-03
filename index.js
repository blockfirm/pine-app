import './src/globals';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import App from './src/App';
import createStore from './src/createStore';
import AppNavigator from './src/navigators/AppNavigator';

const navReducer = (state, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
};

const store = createStore(navReducer);

/**
 * Load app with React Native Navigation. The app is currently
 * using React Navigation for its main navigation but the plan
 * is to gradually migrate to React Native Navigation. It will
 * first be used for displaying transaction details using Peek
 * and Pop with 3D Touch on iOS.
 */
Navigation.registerComponentWithRedux('Pine', () => App, Provider, store);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions({
    layout: {
      backgroundColor: '#FFD200'
    },
    topBar: {
      visible: false
    }
  });

  Navigation.setRoot({
    root: {
      stack: {
        id: 'App',
        children: [{
          component: {
            name: 'Pine',
            passProps: { store }
          }
        }]
      }
    }
  });
});
