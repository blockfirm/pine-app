import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ShowMnemonicScreen from '../../../../src/screens/settings/ShowMnemonicScreen';

jest.mock('../../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');

const storeMock = {
  getState: jest.fn(() => ({
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

describe('ShowMnemonicScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <ShowMnemonicScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
