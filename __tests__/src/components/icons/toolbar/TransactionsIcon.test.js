import React from 'react';
import renderer from 'react-test-renderer';
import TransactionsIcon from '../../../../../src/components/icons/toolbar/TransactionsIcon';

describe('TransactionsIcon', () => {
  it('renders default icon correctly', () => {
    const tree = renderer.create(
      <TransactionsIcon />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders white icon correctly', () => {
    const tree = renderer.create(
      <TransactionsIcon white={true} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
