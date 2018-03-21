import React from 'react';
import renderer from 'react-test-renderer';
import MnemonicWords from '../../../src/components/MnemonicWords';

describe('MnemonicWords', () => {
  it('renders correctly', () => {
    const phrase = 'during bulb nominee acquire paddle next course stable govern eagle title wing';

    const tree = renderer.create(
      <MnemonicWords phrase={phrase} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
