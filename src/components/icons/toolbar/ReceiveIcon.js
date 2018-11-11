import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const IMAGE_DEFAULT = require('../../../images/icons/toolbar/Receive.png');
const IMAGE_WHITE = require('../../../images/icons/toolbar/ReceiveWhite.png');

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50
  }
});

export default class ReceiveIcon extends Component {
  render() {
    const image = this.props.white ? IMAGE_WHITE : IMAGE_DEFAULT;

    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

ReceiveIcon.propTypes = {
  style: PropTypes.any,
  white: PropTypes.bool
};
