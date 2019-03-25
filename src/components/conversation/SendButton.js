import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import SendButtonIcon from '../icons/SendButtonIcon';

const styles = StyleSheet.create({
  button: {
    width: 27,
    height: 27,
    borderRadius: 13,
    backgroundColor: '#FFD23F',
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabled: {
    backgroundColor: '#D8D8DB'
  }
});

export default class SendButton extends Component {
  render() {
    const { disabled } = this.props;

    const buttonStyles = [
      styles.button,
      this.props.style,
      disabled ? styles.disabled : undefined
    ];

    return (
      <TouchableOpacity onPress={this.props.onPress} disabled={disabled} style={buttonStyles}>
        <SendButtonIcon />
      </TouchableOpacity>
    );
  }
}

SendButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: PropTypes.any
};
