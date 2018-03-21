import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import Title from '../../../src/components/Title';

describe('Title', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Title>
        <Text>32a29072-5334-4ad1-a86d-37f6c2639449</Text>
      </Title>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
