import React, { Component } from 'react';
import renderer from 'react-test-renderer';
import createDismissableStackNavigator from '../../src/createDismissableStackNavigator';

jest.mock('react-navigation', () => ({
  createStackNavigator: () => 'StackNavigator'
}));

describe('createDismissableStackNavigator(routes, options)', () => {
  it('is a function', () => {
    expect(typeof createDismissableStackNavigator).toBe('function');
  });

  it('accepts two arguments', () => {
    expect(createDismissableStackNavigator.length).toBe(2);
  });

  it('returns a component', () => {
    const DismissableStackNavigator = createDismissableStackNavigator();
    expect(DismissableStackNavigator.prototype).toBeInstanceOf(Component);
  });

  describe('the component', () => {
    it('renders correctly', () => {
      const DismissableStackNavigator = createDismissableStackNavigator();

      const navigationMock = {
        state: {
          key: '87f275fe-2f44-46d7-a5c5-e9c18913baca'
        },
        goBack: () => {}
      };

      const tree = renderer.create(
        <DismissableStackNavigator
          screenProps={{}}
          navigation={navigationMock}
        />
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
