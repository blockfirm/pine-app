import React from 'react';
import renderer from 'react-test-renderer';
import Toolbar from '../../../../src/components/toolbar/Toolbar';

describe('Toolbar', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Toolbar onPress={() => {}} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
