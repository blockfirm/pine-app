import React from 'react';
import renderer from 'react-test-renderer';
import MnemonicInput from '../../../src/components/MnemonicInput';

describe('MnemonicInput', () => {
  it('renders correctly', () => {
    const correctPhrase = 'during bulb nominee acquire paddle next course stable govern eagle title wing';

    const tree = renderer.create(
      <MnemonicInput correctPhrase={correctPhrase} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
