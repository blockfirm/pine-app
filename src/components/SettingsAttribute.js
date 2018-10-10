import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import settingsStyles from '../styles/settingsStyles';
import StyledText from './StyledText';

export default class SettingsAttribute extends Component {
  render() {
    const isLastItem = this.props.isLastItem;

    const containerStyles = [
      settingsStyles.item,
      isLastItem ? { borderBottomWidth: 0 } : undefined
    ];

    return (
      <View style={containerStyles}>
        <StyledText style={settingsStyles.label}>{this.props.name}</StyledText>
        <StyledText style={settingsStyles.value} numberOfLines={1}>{this.props.value}</StyledText>
      </View>
    );
  }
}

SettingsAttribute.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  isLastItem: PropTypes.bool
};
