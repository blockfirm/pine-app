import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 20,
    color: '#000000',
    backgroundColor: 'transparent'
  }
});

export default class BackButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={this.props.style}>
        <Icon name='chevron-thin-left' style={[styles.icon, this.props.iconStyle]} />
      </TouchableOpacity>
    );
  }
}

BackButton.propTypes = {
  style: PropTypes.any,
  iconStyle: PropTypes.any,
  onPress: PropTypes.func
};
