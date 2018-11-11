import React from 'react';
import renderer from 'react-test-renderer';
import ToolbarButton from '../../../../src/components/toolbar/ToolbarButton';

describe('ToolbarButton', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <ToolbarButton Icon={'Icon'} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
