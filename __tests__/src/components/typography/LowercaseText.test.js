import React from 'react';
import renderer from 'react-test-renderer';
import LowercaseText from '../../../../src/components/typography/LowercaseText';

describe('LowercaseText', () => {
  it('renders text as lowercase', () => {
    const tree = renderer.create(
      <LowercaseText>LOWERCASE</LowercaseText>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
