import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import BaseSettingsScreen from '../../../../src/screens/settings/BaseSettingsScreen';

describe('BaseSettingsScreen', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <BaseSettingsScreen />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
