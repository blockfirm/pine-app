import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  group: {
    backgroundColor: 'white',
    borderTopColor: '#C8C8CC',
    borderBottomColor: '#C8C8CC',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 30
  }
});

export default class SettingsGroup extends Component {
  render() {
    return (
      <View style={[styles.group, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

SettingsGroup.propTypes = {
  style: PropTypes.any,
  children: PropTypes.node
};
