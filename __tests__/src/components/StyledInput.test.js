import React from 'react';
import renderer from 'react-test-renderer';
import StyledInput from '../../../src/components/StyledInput';

describe('StyledInput', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <StyledInput
        autoCapitalize='none'
        returnKeyType='done'
        enforceLowercase={true}
        trim={true}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with border color', () => {
    const tree = renderer.create(
      <StyledInput
        borderColor='#33CF8B'
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
