import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  link: {
    padding: 15
  },
  label: {
    color: '#007AFF',
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: -0.41
  }
});

export default class Link extends Component {
  render() {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={this.props.onPress} style={[styles.link, this.props.style]}>
        <Text>
          <StyledText style={[styles.label, this.props.labelStyle]}>
            {this.props.children}
          </StyledText>
        </Text>
      </TouchableOpacity>
    );
  }
}

Link.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.any,
  labelStyle: PropTypes.any,
  children: PropTypes.node
};
