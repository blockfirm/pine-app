import React from 'react';
import renderer from 'react-test-renderer';
import SettingsOption from '../../../src/components/SettingsOption';

describe('SettingsOption', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <SettingsOption
        name='876f5e88-32ad-444c-8b1a-2d06220dd517'
        value='b7c127e4-0058-4349-af1f-216202322326'
        onSelect={() => {}}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly as the last item', () => {
    const tree = renderer.create(
      <SettingsOption
        name='f8cf85fb-3834-47e6-a8b8-a669e78df02f'
        value='b0a6df8b-db83-4386-a9b8-0f09f252c672'
        onSelect={() => {}}
        isLastItem={true}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
