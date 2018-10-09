import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import Link from '../../../src/components/Link';

describe('Link', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Link onPress={() => {}}>
        <Text>e80d5b55-cad9-4df9-9272-c0398592411b</Text>
      </Link>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
