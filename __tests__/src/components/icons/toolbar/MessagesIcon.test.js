import React from 'react';
import renderer from 'react-test-renderer';
import MessagesIcon from '../../../../../src/components/icons/toolbar/MessagesIcon';

describe('MessagesIcon', () => {
  it('renders default icon correctly', () => {
    const tree = renderer.create(
      <MessagesIcon />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders white icon correctly', () => {
    const tree = renderer.create(
      <MessagesIcon white={true} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
