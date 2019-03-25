import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const image = require('../../images/icons/SendButtonIcon.png');

const styles = StyleSheet.create({
  icon: {
    width: 10,
    height: 11
  }
});

export default class SendButtonIcon extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

SendButtonIcon.propTypes = {
  style: PropTypes.any
};
