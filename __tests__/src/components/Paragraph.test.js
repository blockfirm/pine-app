import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import Paragraph from '../../../src/components/Paragraph';

describe('Paragraph', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Paragraph>
        <Text>111b4b5f-5b3a-46ef-9ffb-7e6c67e56f78</Text>
      </Paragraph>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
