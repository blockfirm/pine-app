import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from '../StyledText';

const styles = StyleSheet.create({
  button: {
    padding: 10,
    paddingRight: 16
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.1,
    color: '#007AFF'
  },
  disabled: {
    color: '#E2E2E2'
  }
});

export default class HeaderButton extends Component {
  render() {
    const { disabled } = this.props;

    const textStyles = [
      styles.text,
      disabled ? styles.disabled : undefined
    ];

    return (
      <TouchableOpacity onPress={this.props.onPress} disabled={disabled} style={styles.button}>
        <Text>
          <StyledText style={textStyles}>
            {this.props.label}
          </StyledText>
        </Text>
      </TouchableOpacity>
    );
  }
}

HeaderButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  disabled: PropTypes.bool
};
