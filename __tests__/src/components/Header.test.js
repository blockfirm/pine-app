import React from 'react';
import renderer from 'react-test-renderer';
import Header from '../../../src/components/Header';

describe('Header', () => {
  it('renders correctly with showBackButton set to false', () => {
    const tree = renderer.create(
      <Header showBackButton={false} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with showBackButton set to true', () => {
    const tree = renderer.create(
      <Header showBackButton={true} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
