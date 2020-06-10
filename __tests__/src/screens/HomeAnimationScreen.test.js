import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import HomeAnimationScreen from '../../../src/screens/HomeAnimationScreen';

jest.mock('../../../src/containers/BackHeaderContainer', () => 'BackHeaderContainer');
jest.mock('../../../src/containers/ContactListContainer', () => 'ContactListContainer');
jest.mock('../../../src/screens/ContactsScreen', () => 'ContactsScreen');
jest.mock('../../../src/screens/ReceiveScreen', () => 'ReceiveScreen');
jest.mock('../../../src/screens/CameraScreen', () => 'CameraScreen');

const storeMock = {
  getState: jest.fn(() => ({
    network: {
      internet: {
        disconnected: false
      }
    },
    navigate: {
      homeScreen: {
        index: 1
      }
    },
    settings: {
      lightning: {
        isSetup: true
      }
    }
  })),
  dispatch: jest.fn(() => Promise.resolve()),
  subscribe: jest.fn()
};

describe('HomeAnimationScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <HomeAnimationScreen store={storeMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
