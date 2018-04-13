import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 32,
    color: '#322A51',
    backgroundColor: 'transparent'
  }
});

export default class BackButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={this.props.style}>
        <Icon name='ios-arrow-round-back-outline' style={[styles.icon, this.props.iconStyle]} />
      </TouchableOpacity>
    );
  }
}

BackButton.propTypes = {
  style: PropTypes.any,
  iconStyle: PropTypes.any,
  onPress: PropTypes.func
};
