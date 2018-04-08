import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  link: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8069DC'
  }
});

export default class Link extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Text>
          <StyledText style={[styles.link, this.props.style]}>
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
  children: PropTypes.node
};
