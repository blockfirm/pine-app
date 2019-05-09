import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const IMAGE = require('../../images/indicators/SentIndicator.png');

const styles = StyleSheet.create({
  image: {
    width: 9,
    height: 10
  }
});

export default class SentIndicator extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <Image source={IMAGE} style={styles.image} />
      </View>
    );
  }
}

SentIndicator.propTypes = {
  style: PropTypes.any
};
