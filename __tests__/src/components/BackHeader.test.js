import React from 'react';
import renderer from 'react-test-renderer';
import BackHeader from '../../../src/components/BackHeader';

describe('BackHeader', () => {
  it('renders correctly with showBackButton set to false', () => {
    const tree = renderer.create(
      <BackHeader showBackButton={false} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with showBackButton set to true', () => {
    const tree = renderer.create(
      <BackHeader showBackButton={true} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
