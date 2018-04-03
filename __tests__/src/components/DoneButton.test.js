import React from 'react';
import renderer from 'react-test-renderer';
import DoneButton from '../../../src/components/DoneButton';

describe('DoneButton', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <DoneButton />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
