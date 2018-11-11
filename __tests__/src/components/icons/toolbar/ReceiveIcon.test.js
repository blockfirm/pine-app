import React from 'react';
import renderer from 'react-test-renderer';
import ReceiveIcon from '../../../../../src/components/icons/toolbar/ReceiveIcon';

describe('ReceiveIcon', () => {
  it('renders default icon correctly', () => {
    const tree = renderer.create(
      <ReceiveIcon />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders white icon correctly', () => {
    const tree = renderer.create(
      <ReceiveIcon white={true} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
