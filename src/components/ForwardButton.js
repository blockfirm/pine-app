import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 10
  },
  icon: {
    paddingLeft: 10,
    fontSize: 20,
    color: '#000000',
    backgroundColor: 'transparent'
  }
});

export default class ForwardButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={[styles.button, this.props.style]}>
        <Icon name='chevron-thin-right' style={[styles.icon, this.props.iconStyle]} />
      </TouchableOpacity>
    );
  }
}

ForwardButton.propTypes = {
  style: PropTypes.any,
  iconStyle: PropTypes.any,
  onPress: PropTypes.func
};
