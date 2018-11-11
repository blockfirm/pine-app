import React from 'react';
import renderer from 'react-test-renderer';
import SendIcon from '../../../../../src/components/icons/toolbar/SendIcon';

describe('SendIcon', () => {
  it('renders default icon correctly', () => {
    const tree = renderer.create(
      <SendIcon />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders white icon correctly', () => {
    const tree = renderer.create(
      <SendIcon white={true} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
