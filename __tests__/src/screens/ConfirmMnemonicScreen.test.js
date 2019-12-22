import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ConfirmMnemonicScreen from '../../../src/screens/ConfirmMnemonicScreen';

jest.mock('../../../src/containers/BackHeaderContainer', () => 'BackHeaderContainer');

const storeMock = {
  getState: jest.fn(() => ({
    settings: {
      bitcoin: {
        network: 'testnet'
      }
    }
  })),
  dispatch: jest.fn(),
  subscribe: jest.fn()
};

describe('ConfirmMnemonicScreen', () => {
  it('renders correctly', () => {
    const mnemonic = 'during bulb nominee acquire paddle next course stable govern eagle title wing';

    const navigationMock = {
      state: {
        params: { mnemonic }
      }
    };

    const tree = renderer.create(
      <ConfirmMnemonicScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
