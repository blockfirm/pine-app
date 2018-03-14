import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  text: {
    color: '#000000',
    fontFamily: 'System',
    fontWeight: '400'
  }
});

export default class StyledText extends Component {
  render() {
    return (
      <Text style={[styles.text, this.props.style]} numberOfLines={this.props.numberOfLines}>
        {this.props.children}
      </Text>
    );
  }
}

StyledText.propTypes = {
  style: PropTypes.any,
  numberOfLines: PropTypes.number,
  children: PropTypes.node
};
