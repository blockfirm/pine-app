import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 27
  }
});

class SettingsIcon extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <Image source={this.props.theme.settingsIcon} style={styles.icon} />
      </View>
    );
  }
}

SettingsIcon.propTypes = {
  style: PropTypes.any,
  theme: PropTypes.object
};

export default withTheme(SettingsIcon);
