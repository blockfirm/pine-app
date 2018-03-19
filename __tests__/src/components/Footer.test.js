import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import Footer from '../../../src/components/Footer';

describe('Footer', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Footer>
        <Text>0750eb7b-6bc0-4142-82e2-035068d50726</Text>
      </Footer>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
