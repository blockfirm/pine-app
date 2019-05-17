import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ProfileScreen from '../../../../src/screens/settings/ProfileScreen';

jest.mock('../../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');
jest.mock('../../../../src/components/BackButton', () => 'BackButtonBackButton');
jest.mock('../../../../src/components/SettingsTitle', () => 'SettingsTitle');
jest.mock('../../../../src/components/SettingsGroup', () => 'SettingsGroup');
jest.mock('../../../../src/components/SettingsLink', () => 'SettingsLink');
jest.mock('../../../../src/components/SettingsButton', () => 'SettingsButton');
jest.mock('../../../../src/components/StyledText', () => 'StyledText');
jest.mock('../../../../src/components/EditAvatar', () => 'EditAvatar');
jest.mock('../../../../src/components/CopyText', () => 'CopyText');

const storeMock = {
  getState: jest.fn(() => ({
    settings: {
      user: {
        hasCreatedBackup: false,
        profile: {
          avatar: {
            checksum: 'cb3e77ab-5cf3-4ff6-a599-e3eb45b2916d'
          }
        }
      }
    },
    bitcoin: {
      wallet: {
        balance: 0
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

describe('ProfileScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <ProfileScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
