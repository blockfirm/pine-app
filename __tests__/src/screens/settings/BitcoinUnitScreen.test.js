import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import BitcoinUnitScreen from '../../../../src/screens/settings/BitcoinUnitScreen';

jest.mock('../../../../src/containers/BalanceLabelContainer', () => 'BalanceLabelContainer');

const storeMock = {
  getState: jest.fn(() => ({
    settings: {
      bitcoin: {
        unit: 'BTC'
      }
    }
  })),
  dispatch: jest.fn(),
  subscribe: jest.fn()
};

const navigationMock = {
  navigate: jest.fn(),
  state: {
    params: {}
  }
};

describe('BitcoinUnitScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <BitcoinUnitScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
