import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import SettingsScreen from '../../../../src/screens/settings/SettingsScreen';

jest.mock('../../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');

const storeMock = {
  getState: jest.fn(() => ({
    settings: {
      user: {
        profile: {
          pineAddress: 'timothy@pine.cash'
        }
      },
      api: {
        baseUrl: 'f02f296b-05f9-4db1-a35a-37a3eb3b3f56'
      },
      bitcoin: {
        unit: 'BTC',
        fee: {
          level: 'Normal',
          satoshisPerByte: 100
        }
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
