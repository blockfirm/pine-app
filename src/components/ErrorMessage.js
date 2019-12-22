import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import CopyText from './CopyText';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  errorWrapper: {
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

class ErrorMessage extends Component {
  render() {
    const { title, message, details, theme } = this.props;
    const copyText = `${message}\n${details}`;

    return (
      <CopyText tooltipArrowDirection='up' copyText={copyText}>
        <View style={[styles.errorWrapper, theme.errorMessage]}>
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
  message: PropTypes.string,
  details: PropTypes.string,
  theme: PropTypes.object.isRequired
};

export default withTheme(ErrorMessage);
