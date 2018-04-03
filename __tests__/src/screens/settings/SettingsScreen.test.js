import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import SettingsScreen from '../../../../src/screens/settings/SettingsScreen';

jest.mock('../../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');

const storeMock = {
  getState: jest.fn(() => ({
    settings: {
      bitcoin: {
        unit: 'BTC'
      }
    },
    keys: {
      items: {}
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

describe('SettingsScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <SettingsScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
