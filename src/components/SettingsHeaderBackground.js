import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme';

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignSelf: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});

const SettingsHeaderBackground = function ({ theme }) {
  return (
    <View style={[styles.header, theme.settingsHeader]} />
  );
};

SettingsHeaderBackground.propTypes = {
  theme: PropTypes.object.isRequired
};

export default withTheme(SettingsHeaderBackground);
