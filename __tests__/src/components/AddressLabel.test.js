import React from 'react';
import renderer from 'react-test-renderer';
import AddressLabel from '../../../src/components/AddressLabel';

describe('AddressLabel', () => {
  it('renders an address correctly', () => {
    const tree = renderer.create(
      <AddressLabel address='moYihV4R1FoSbnukt9sV3WqeFNHnvxfesx' />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders an empty address correctly', () => {
    const tree = renderer.create(
      <AddressLabel />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
