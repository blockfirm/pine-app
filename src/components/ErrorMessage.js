import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import CopyText from './CopyText';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  errorWrapper: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 15,
    marginBottom: 16
  },
  errorTitle: {
    color: 'white',
    fontWeight: '600'
  },
  errorText: {
    color: 'white'
  }
});

export default class ErrorMessage extends Component {
  render() {
    const { title, message } = this.props;

    return (
      <CopyText tooltipArrowDirection='up' copyText={message}>
        <View style={styles.errorWrapper}>
          <StyledText style={styles.errorTitle}>
            {title}
          </StyledText>
          <StyledText style={styles.errorText}>
            {message}
          </StyledText>
        </View>
      </CopyText>
    );
  }
}

ErrorMessage.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string
};
