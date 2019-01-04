import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  bullet: {
    marginHorizontal: 10,
    height: 3,
    width: 3,
    borderRadius: 2,
    backgroundColor: '#8A8A8F'
  }
});

export default class Bullet extends Component {
  render() {
    return (
      <View style={[styles.bullet, this.props.style]} />
    );
  }
}

Bullet.propTypes = {
  style: PropTypes.any
};
