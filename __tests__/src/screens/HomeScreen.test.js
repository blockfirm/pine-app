import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from '../../../src/screens/HomeScreen';

jest.mock('../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');
jest.mock('../../../src/containers/BackHeaderContainer', () => 'BackHeaderContainer');
jest.mock('../../../src/containers/TransactionListContainer', () => 'TransactionListContainer');
jest.mock('../../../src/screens/TransactionsScreen', () => 'TransactionsScreen');
jest.mock('../../../src/screens/ReceiveScreen', () => 'ReceiveScreen');
jest.mock('../../../src/screens/CameraScreen', () => 'CameraScreen');

const storeMock = {
  getState: jest.fn(() => ({
    network: {
      internet: {
        disconnected: false
      }
    },
    homeScreen: {
      index: 1
    }
  })),
  dispatch: jest.fn(() => Promise.resolve()),
  subscribe: jest.fn()
};

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <HomeScreen store={storeMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
