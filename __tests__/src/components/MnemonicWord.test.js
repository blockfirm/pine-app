import React from 'react';
import renderer from 'react-test-renderer';
import MnemonicWord from '../../../src/components/MnemonicWord';

describe('MnemonicWord', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <MnemonicWord index={10} word='bulb' />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
