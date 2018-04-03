import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import DisclaimerScreen from '../../../src/screens/DisclaimerScreen';

jest.mock('../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');
jest.mock('../../../src/containers/HeaderContainer', () => 'HeaderContainer');

const storeMock = {
  getState: jest.fn(() => ({})),
  dispatch: jest.fn()
};

const navigationMock = {
  state: {
    params: {}
  }
};

describe('DisclaimerScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <DisclaimerScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
