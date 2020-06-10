import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  border: {
    width: 10,
    height: 10,
    borderWidth: 2,
    borderRadius: 5
  }
});

class WarningDotIndicator extends Component {
  render() {
    const { style, withBorder, theme } = this.props;

    if (withBorder) {
      return (
        <View style={[styles.border, { borderColor: theme.palette.background }, style]}>
          <View style={[styles.dot, { backgroundColor: theme.statusWarningColor }]} />
        </View>
      );
    }

    return (
      <View style={[styles.dot, { backgroundColor: theme.statusWarningColor }, style]} />
    );
  }
}

WarningDotIndicator.propTypes = {
  style: PropTypes.any,
  withBorder: PropTypes.bool,
  theme: PropTypes.object
};

export default withTheme(WarningDotIndicator);
