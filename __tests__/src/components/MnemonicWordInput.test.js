import React from 'react';
import renderer from 'react-test-renderer';
import MnemonicWordInput from '../../../src/components/MnemonicWordInput';

describe('MnemonicWordInput', () => {
  let onChangeText;

  beforeEach(() => {
    onChangeText = jest.fn();
  });

  it('renders correctly', () => {
    const tree = renderer.create(
      <MnemonicWordInput
        index={1}
        onChangeText={onChangeText}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correct words correctly', () => {
    const tree = renderer.create(
      <MnemonicWordInput
        index={2}
        onChangeText={onChangeText}
        isCorrect={true}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders incorrect words correctly', () => {
    const tree = renderer.create(
      <MnemonicWordInput
        index={3}
        onChangeText={onChangeText}
        isIncorrect={true}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
