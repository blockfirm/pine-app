import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ImportMnemonicScreen from '../../../src/screens/ImportMnemonicScreen';

jest.mock('../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');
jest.mock('../../../src/containers/HeaderContainer', () => 'HeaderContainer');

const storeMock = {
  getState: jest.fn(() => ({})),
  dispatch: jest.fn()
};

describe('ImportMnemonicScreen', () => {
  it('renders correctly', () => {
    const navigationMock = {
      state: {
        params: {}
      }
    };

    const tree = renderer.create(
      <ImportMnemonicScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
