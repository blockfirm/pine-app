import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import BackIcon from './icons/BackIcon';

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 5
  },
  icon: {
    padding: 10
  }
});

export default class BackButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={[styles.button, this.props.style]}>
        <BackIcon style={[styles.icon, this.props.iconStyle]} />
      </TouchableOpacity>
    );
  }
}

BackButton.propTypes = {
  style: PropTypes.any,
  iconStyle: PropTypes.any,
  onPress: PropTypes.func
};
