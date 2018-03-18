import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from '../../../src/screens/HomeScreen';

jest.mock('../../../src/containers/ErrorModalContainer', () => 'ErrorModalContainer');

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <HomeScreen />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
