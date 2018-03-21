import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import WelcomeScreen from '../../../src/screens/WelcomeScreen';

jest.mock('../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');
jest.mock('../../../src/containers/HeaderContainer', () => 'HeaderContainer');

const storeMock = {
  getState: jest.fn(() => ({})),
  dispatch: jest.fn()
};

describe('WelcomeScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <WelcomeScreen store={storeMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
