import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import CancelButtonIcon from '../icons/CancelButtonIcon';

const styles = StyleSheet.create({
  button: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default class CancelButton extends Component {
  render() {
    const buttonStyles = [
      styles.button,
      this.props.style
    ];

    return (
      <TouchableOpacity onPress={this.props.onPress} style={buttonStyles}>
        <CancelButtonIcon />
      </TouchableOpacity>
    );
  }
}

CancelButton.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.any
};
