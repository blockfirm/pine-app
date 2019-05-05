import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    padding: 8
  },
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
    const { Icon, disabled, onPress, style, containerStyle } = this.props;

    const buttonStyles = [
      styles.button,
      style,
      disabled ? styles.disabled : undefined
    ];

    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.container, containerStyle]}>
        <View style={buttonStyles}>
          <Icon />
        </View>
      </TouchableOpacity>
    );
  }
}

InputBarButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  style: PropTypes.any,
  containerStyle: PropTypes.any,
  Icon: PropTypes.func
};
