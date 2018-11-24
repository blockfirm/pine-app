import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    width: 10,
    height: 17
  }
});

export default class BackIcon extends Component {
  render() {
    const image = require('../../images/icons/Back.png');

    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

BackIcon.propTypes = {
  style: PropTypes.any
};
