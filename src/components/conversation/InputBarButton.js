import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  button: {
    width: 29,
    height: 29,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabled: {
    backgroundColor: '#D8D8DB'
  }
});

export default class InputBarButton extends Component {
  render() {
    const { Icon, disabled } = this.props;

    const buttonStyles = [
      styles.button,
      this.props.style,
      disabled ? styles.disabled : undefined
    ];

    return (
      <TouchableOpacity onPress={this.props.onPress} disabled={disabled} style={buttonStyles}>
        <Icon />
      </TouchableOpacity>
    );
  }
}

InputBarButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: PropTypes.any,
  Icon: PropTypes.instanceOf(Component)
};
