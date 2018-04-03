import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import AboutScreen from '../../../../src/screens/settings/AboutScreen';

jest.mock('../../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');

const storeMock = {
  getState: jest.fn(() => ({})),
  dispatch: jest.fn()
};

const navigationMock = {
  navigate: jest.fn(),
  state: {
    params: {}
  }
};

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <AboutScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
