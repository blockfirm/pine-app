import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 15,
    marginLeft: 15,
    borderBottomColor: '#C8C7CC',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  label: {
    fontWeight: '400'
  },
  value: {
    position: 'absolute',
    top: 12,
    right: 15,
    color: '#8F8E94',
    textAlign: 'right',
    width: 150
  }
});

export default class SettingsAttribute extends Component {
  render() {
    const isLastItem = this.props.isLastItem;

    const containerStyles = [
      styles.container,
      isLastItem ? { borderBottomWidth: 0 } : undefined
    ];

    return (
      <View style={containerStyles}>
        <StyledText style={styles.label}>{this.props.name}</StyledText>
        <StyledText style={styles.value} numberOfLines={1}>{this.props.value}</StyledText>
      </View>
    );
  }
}

SettingsAttribute.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  isLastItem: PropTypes.bool
};
