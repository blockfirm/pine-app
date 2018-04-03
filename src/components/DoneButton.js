import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  button: {
    padding: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF'
  }
});

export default class DoneButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.button}>
        <Text>
          <StyledText style={styles.text}>
            Done
          </StyledText>
        </Text>
      </TouchableOpacity>
    );
  }
}

DoneButton.propTypes = {
  onPress: PropTypes.func
};
