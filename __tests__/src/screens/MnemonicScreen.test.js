import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import MnemonicScreen from '../../../src/screens/MnemonicScreen';

jest.mock('../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');
jest.mock('../../../src/containers/HeaderContainer', () => 'HeaderContainer');
jest.mock('../../../src/containers/MnemonicWordsContainer', () => 'MnemonicWordsContainer');

const storeMock = {
  getState: jest.fn(() => ({
    recoveryKey: {
      visible: true
    }
  })),
  dispatch: jest.fn(),
  subscribe: jest.fn()
};

describe('MnemonicScreen', () => {
  it('renders correctly', () => {
    const mnemonic = 'during bulb nominee acquire paddle next course stable govern eagle title wing';

    const navigationMock = {
      state: {
        params: { mnemonic }
      }
    };

    const tree = renderer.create(
      <MnemonicScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
