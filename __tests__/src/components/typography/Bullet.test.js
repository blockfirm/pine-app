import React from 'react';
import renderer from 'react-test-renderer';
import Bullet from '../../../../src/components/typography/Bullet';

describe('Bullet', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Bullet />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
