import React from 'react';
import renderer from 'react-test-renderer';
import SettingsInput from '../../../src/components/SettingsInput';

describe('SettingsInput', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <SettingsInput
        value='5f2d5a31-66cc-438f-9136-085e1c8ceb2b'
        placeholder='f69225ae-ee9b-4e45-9688-4a74ae3b82e9'
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
