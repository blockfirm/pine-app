import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import StyledText from '../../../src/components/StyledText';

describe('StyledText', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <StyledText numberOfLines={1}>
        <Text>a7c7a003-f65a-4373-b0db-dc744c4e3e9f</Text>
      </StyledText>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
