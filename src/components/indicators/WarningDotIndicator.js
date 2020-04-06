import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3
  }
});

class WarningDotIndicator extends Component {
  render() {
    const { style, theme } = this.props;

    const dotStyle = [
      styles.dot,
      { backgroundColor: theme.statusWarningColor },
      style
    ];

    return (
      <View style={dotStyle} />
    );
  }
}

WarningDotIndicator.propTypes = {
  style: PropTypes.any,
  theme: PropTypes.object
};

export default withTheme(WarningDotIndicator);
