import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';

import createStore from '../../src/createStore';
import AppNavigator from '../../src/navigators/AppNavigator';
import App from '../../src/App';

jest.mock('../../src/screens/WelcomeScreen', () => 'WelcomeScreen');

const navReducer = (state, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
};

const store = createStore(navReducer);

describe('App', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Provider store={store}>
        <App store={store} />
      </Provider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
