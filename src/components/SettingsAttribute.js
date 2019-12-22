import React, { Component } from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../contexts/theme';
import settingsStyles from '../styles/settingsStyles';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  switchWrapper: {
    width: null
  }
});

class SettingsAttribute extends Component {
  _renderValue() {
    const { value, theme } = this.props;

    if (typeof value === 'boolean') {
      return (
        <View style={[settingsStyles.value, styles.switchWrapper]}>
          <Switch value={value} onValueChange={this.props.onValueChange}></Switch>
        </View>
      );
    }

    return (
      <StyledText style={[settingsStyles.value, theme.settingsValue]} numberOfLines={1}>
        {value}
      </StyledText>
    );
  }

  render() {
    const { isLastItem, theme } = this.props;

    const containerStyles = [
      settingsStyles.item,
      theme.settingsItem,
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
  isLastItem: PropTypes.bool,
  theme: PropTypes.object.isRequired
};

export default withTheme(SettingsAttribute);
