import React, { Component } from 'react';
import renderer from 'react-test-renderer';
import DismissableStackNavigator from '../../src/DismissableStackNavigator';

jest.mock('react-navigation', () => ({
  StackNavigator: () => 'StackNav'
}));

describe('DismissableStackNavigator(routes, options)', () => {
  it('is a function', () => {
    expect(typeof DismissableStackNavigator).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(DismissableStackNavigator.length).toBe(2);
  });

  it('returns a component', () => {
    // eslint-disable-next-line new-cap
    const DismissableStackNav = DismissableStackNavigator();
    expect(DismissableStackNav.prototype).toBeInstanceOf(Component);
  });

  describe('the component', () => {
    it('renders correctly', () => {
      // eslint-disable-next-line new-cap
      const DismissableStackNav = DismissableStackNavigator();

      const navigationMock = {
        state: {
          key: '87f275fe-2f44-46d7-a5c5-e9c18913baca'
        },
        goBack: () => {}
      };

      const tree = renderer.create(
        <DismissableStackNav
          screenProps={{}}
          navigation={navigationMock}
        />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
