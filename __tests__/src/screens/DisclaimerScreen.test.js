import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import DisclaimerScreen from '../../../src/screens/DisclaimerScreen';

jest.mock('../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');
jest.mock('../../../src/containers/BackHeaderContainer', () => 'BackHeaderContainer');

const navigationMock = {
  state: {
    params: {}
  }
};

describe('DisclaimerScreen', () => {
  it('renders correctly when user has no manual backup (using iCloud as backup)', () => {
    const storeMock = {
      getState: jest.fn(() => ({
        settings: {
          user: {
            hasCreatedBackup: false,
            profile: {
              address: 'timothy@pine.cash'
            }
          }
        }
      })),
      dispatch: jest.fn(),
      subscribe: jest.fn()
    };

    const tree = renderer.create(
      <DisclaimerScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when user has a manual backup (not using iCloud as backup)', () => {
    const storeMock = {
      getState: jest.fn(() => ({
        settings: {
          user: {
            hasCreatedBackup: true,
            profile: {
              address: 'timothy@pine.cash'
            }
          }
        }
      })),
      dispatch: jest.fn(),
      subscribe: jest.fn()
    };

    const tree = renderer.create(
      <DisclaimerScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
