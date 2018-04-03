import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import StrongText from '../../../src/components/StrongText';

describe('StrongText', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <StrongText>
        <Text>27125870-9efa-4ddd-b8fb-4f520751cd1d</Text>
      </StrongText>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
