import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Button from '../Button';

const styles = StyleSheet.create({
  button: {
    width: null,
    height: null,
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 14
  }
});

export default class SmallButton extends Component {
  render() {
    return (
      <Button
        {...this.props}
        style={[styles.button, this.props.style]}
      />
    );
  }
}
