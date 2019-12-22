import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import TermsAndConditionsScreen from '../../../../src/screens/settings/TermsAndConditionsScreen';

const storeMock = {
  getState: jest.fn(() => ({})),
  dispatch: jest.fn(),
  subscribe: jest.fn()
};

const navigationMock = {
  navigate: jest.fn(),
  state: {
    params: {}
  }
};

describe('TermsAndConditionsScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <TermsAndConditionsScreen store={storeMock} navigation={navigationMock} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
