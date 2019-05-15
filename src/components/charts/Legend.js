import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from '../StyledText';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  color: {
    height: 11,
    width: 11,
    borderRadius: 3
  },
  label: {
    marginLeft: 6,
    fontSize: 12,
    color: 'black'
  }
});

export default class Legend extends Component {
  render() {
    const { color, label, style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <View
          style={[styles.color, { backgroundColor: color }]}
        />
        <StyledText style={styles.label}>
          {label}
        </StyledText>
      </View>
    );
  }
}

Legend.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.any
};
