import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../../../src/components/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Button label='06b5f369-ec66-4e0a-8777-90c71dec3f7b' onPress={() => {}} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly in full width', () => {
    const tree = renderer.create(
      <Button label='099349fd-1c84-415b-818f-c8c6af2ea8e7' fullWidth={true} onPress={() => {}} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as disabled', () => {
    const tree = renderer.create(
      <Button label='15013b10-4256-4d32-b25f-a031dfb6ce95' disabled={true} onPress={() => {}} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
