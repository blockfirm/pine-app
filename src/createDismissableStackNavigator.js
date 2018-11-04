import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';

const createDismissableStackNavigator = (routes, options) => {
  const StackNavigator = createStackNavigator(routes, options);

  return class DismissableStackNavigator extends Component {
    static router = StackNavigator.router;

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
        <StackNavigator
          screenProps={props}
          navigation={this.props.navigation}
        />
      );
    }
  };
};

export default createDismissableStackNavigator;
