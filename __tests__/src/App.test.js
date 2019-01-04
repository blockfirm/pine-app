import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import App from '../../src/App';

jest.mock('../../src/screens/WelcomeScreen', () => 'WelcomeScreen');

describe('App', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <App />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
