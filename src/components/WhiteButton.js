import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Button from './Button';

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 0
  },
  label: {
    color: '#FFD23F'
  },
  disabled: {
    backgroundColor: 'white'
  }
});

export default class WhiteButton extends Component {
  render() {
    return (
      <Button
        {...this.props}
        style={[styles.button, this.props.style]}
        labelStyle={styles.label}
        disabledStyle={styles.disabled}
        loaderColor='#FFD23F'
      />
    );
  }
}

WhiteButton.propTypes = {
  style: PropTypes.any
};
