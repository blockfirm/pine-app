import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

export default class Camera extends Component {
  render() {
    return (
      <View {...this.props}>
        {this.props.children}
      </View>
    );
  }
}

Camera.propTypes = {
  children: PropTypes.node
};
