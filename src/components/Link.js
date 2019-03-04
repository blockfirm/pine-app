import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Button from './Button';

const styles = StyleSheet.create({
  wrapper: {
    width: null,
    height: null,
    padding: 15,
    borderRadius: 0,
    backgroundColor: null
  },
  label: {
    color: '#007AFF',
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16
  },
  disabledStyle: {
    backgroundColor: null
  }
});

export default class Link extends Component {
  render() {
    return (
      <Button
        {...this.props}
        label={this.props.children}
        style={[styles.wrapper, this.props.style]}
        labelStyle={[styles.label, this.props.labelStyle]}
        disabledStyle={[styles.disabledStyle, this.props.disabledStyle]}
        loaderColor={this.props.loaderColor || 'gray'}
      />
    );
  }
}
