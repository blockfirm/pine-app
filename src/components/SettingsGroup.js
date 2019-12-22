import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme';

const styles = StyleSheet.create({
  group: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 35
  }
});

class SettingsGroup extends Component {
  render() {
    const { children, style, theme } = this.props;

    return (
      <View style={[styles.group, theme.settingsGroup, style]}>
        {children}
      </View>
    );
  }
}

SettingsGroup.propTypes = {
  style: PropTypes.any,
  children: PropTypes.node,
  theme: PropTypes.object.isRequired
};

export default withTheme(SettingsGroup);
