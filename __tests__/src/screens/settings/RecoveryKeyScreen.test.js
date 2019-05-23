import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import RecoveryKeyScreen from '../../../../src/screens/settings/RecoveryKeyScreen';

jest.mock('../../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');
jest.mock('../../../../src/containers/MnemonicWordsContainer', () => 'MnemonicWordsContainer');

const storeMock = {
  getState: jest.fn(() => ({
    settings: {
      user: {
        hasCreatedBackup: false,
        profile: {
          address: 'test@pine.dev'
        }
      }
    },
    keys: {
      items: {
        'b62a06e9-7a1f-4862-a350-7af4505114c7': {
          id: 'b62a06e9-7a1f-4862-a350-7af4505114c7'
        }
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

describe('RecoveryKeyScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <RecoveryKeyScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
