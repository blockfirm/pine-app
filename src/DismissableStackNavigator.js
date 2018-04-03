import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';

export default function DismissableStackNavigator(routes, options) {
  // eslint-disable-next-line new-cap
  const StackNav = StackNavigator(routes, options);

  return class DismissableStackNav extends Component {
    static router = StackNav.router;

    static propTypes = {
      navigation: PropTypes.object,
      screenProps: PropTypes.object
    };

    render() {
      const { state, goBack } = this.props.navigation;

      const props = {
        ...this.props.screenProps,
        dismiss: () => goBack(state.key)
      };

      return (
        <StackNav
          screenProps={props}
          navigation={this.props.navigation}
        />
      );
    }
  };
}
