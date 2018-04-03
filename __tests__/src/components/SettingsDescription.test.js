import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import SettingsDescription from '../../../src/components/SettingsDescription';

describe('SettingsDescription', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <SettingsDescription>
        <Text>698350fe-6f2f-487c-adad-a9f5a7f27b59</Text>
      </SettingsDescription>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
