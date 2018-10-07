import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 27
  }
});

export default class SettingsIcon extends Component {
  render() {
    const image = require('../../images/icons/Settings.png');

    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

SettingsIcon.propTypes = {
  style: PropTypes.any
};
