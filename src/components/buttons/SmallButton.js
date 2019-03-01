import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Button from '../Button';

const styles = StyleSheet.create({
  button: {
    width: null,
    height: null,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 7
  },
  label: {
    fontSize: 15,
    letterSpacing: null
  }
});

export default class SmallButton extends Component {
  render() {
    return (
      <Button
        {...this.props}
        style={[this.props.style, styles.button]}
        labelStyle={[this.props.style, styles.button]}
      />
    );
  }
}
