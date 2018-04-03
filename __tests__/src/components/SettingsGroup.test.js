import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import SettingsGroup from '../../../src/components/SettingsGroup';

describe('SettingsGroup', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <SettingsGroup>
        <Text>7ec4a1e5-7bc9-4e48-99cc-304d19ebc138</Text>
      </SettingsGroup>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
