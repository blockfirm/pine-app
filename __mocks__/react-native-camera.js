import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

export class RNCamera extends Component {
  render() {
    return (
      <View {...this.props}>
        {this.props.children}
      </View>
    );
  }
}

RNCamera.propTypes = {
  children: PropTypes.node
};
