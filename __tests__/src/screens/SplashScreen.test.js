import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import SplashScreen from '../../../src/screens/SplashScreen';

jest.mock('../../../src/containers/BackHeaderContainer', () => 'BackHeaderContainer');

const storeMock = {
  getState: jest.fn(() => ({})),
  dispatch: jest.fn(() => Promise.resolve())
};

describe('SplashScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <SplashScreen store={storeMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
