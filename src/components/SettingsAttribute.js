import React, { Component } from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import PropTypes from 'prop-types';

import settingsStyles from '../styles/settingsStyles';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  switchWrapper: {
    width: null
  }
});

export default class SettingsAttribute extends Component {
  _renderValue() {
    const value = this.props.value;

    if (typeof value === 'boolean') {
      return (
        <View style={[settingsStyles.value, styles.switchWrapper]}>
          <Switch value={value} onValueChange={this.props.onValueChange}></Switch>
        </View>
      );
    }

    return (
      <StyledText style={settingsStyles.value} numberOfLines={1}>{value}</StyledText>
    );
  }

  render() {
    const isLastItem = this.props.isLastItem;

    const containerStyles = [
      settingsStyles.item,
      isLastItem ? { borderBottomWidth: 0 } : undefined
    ];

    return (
      <View style={containerStyles}>
        <StyledText style={settingsStyles.label}>{this.props.name}</StyledText>
        {this._renderValue()}
      </View>
    );
  }
}

SettingsAttribute.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  onValueChange: PropTypes.func,
  isLastItem: PropTypes.bool
};
