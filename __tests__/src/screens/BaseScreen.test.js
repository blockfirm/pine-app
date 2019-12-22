import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import BaseScreen from '../../../src/screens/BaseScreen';

jest.mock('../../../src/containers/BackHeaderContainer', () => 'BackHeaderContainer');

describe('BaseScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <BaseScreen />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
