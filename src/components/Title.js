import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const windowDimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  title: {
    fontSize: windowDimensions.width < 330 ? 16 : 18,
    fontWeight: '600',
    letterSpacing: 0.36,
    marginBottom: windowDimensions.width < 330 ? 7 : 10,
    textAlign: 'center',
    color: '#26203D'
  }
});

export default class Title extends Component {
  render() {
    return (
      <StyledText style={[styles.title, this.props.style]}>
        {this.props.children}
      </StyledText>
    );
  }
}

Title.propTypes = {
  style: PropTypes.any,
  children: PropTypes.node
};
