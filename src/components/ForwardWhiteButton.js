import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import ForwardWhiteIcon from './icons/ForwardWhiteIcon';

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 0
  }
});

export default class ForwardWhiteButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={[styles.button, this.props.style]}>
        <ForwardWhiteIcon />
      </TouchableOpacity>
    );
  }
}

ForwardWhiteButton.propTypes = {
  style: PropTypes.any,
  onPress: PropTypes.func
};
