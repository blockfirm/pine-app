import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  button: {
    padding: 10,
    paddingLeft: 16,
    paddingRight: 16
  },
  text: {
    fontSize: 17
  }
});

class CancelButton extends Component {
  render() {
    const { theme } = this.props;

    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.button}>
        <Text>
          <StyledText style={[styles.text, theme.text]}>
            Cancel
          </StyledText>
        </Text>
      </TouchableOpacity>
    );
  }
}

CancelButton.propTypes = {
  onPress: PropTypes.func,
  theme: PropTypes.object.isRequired
};

export default withTheme(CancelButton);
