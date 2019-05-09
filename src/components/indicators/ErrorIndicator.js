import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const IMAGE = require('../../images/indicators/ErrorIndicator.png');

const styles = StyleSheet.create({
  image: {
    width: 10,
    height: 10
  }
});

export default class ErrorIndicator extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <Image source={IMAGE} style={styles.image} />
      </View>
    );
  }
}

ErrorIndicator.propTypes = {
  style: PropTypes.any
};
