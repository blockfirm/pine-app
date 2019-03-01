import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const PRESS_FREEZE_MS = 1000; // Don't allow another press until 1s after the previous press.

const styles = StyleSheet.create({
  link: {
    padding: 15
  },
  label: {
    color: '#007AFF',
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16
  }
});

export default class Link extends Component {
  _shouldAllowPress() {
    const lastPressTimestamp = this._lastPressTimestamp || 0;
    const now = new Date().getTime();

    // Don't allow too frequent presses.
    return now - lastPressTimestamp > PRESS_FREEZE_MS;
  }

  _onPress() {
    if (!this._shouldAllowPress()) {
      return;
    }

    this._lastPressTimestamp = new Date().getTime();

    this.props.onPress();
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={this._onPress.bind(this)} style={[styles.link, this.props.style]}>
        <Text>
          <StyledText style={[styles.label, this.props.labelStyle]}>
            {this.props.children}
          </StyledText>
        </Text>
      </TouchableOpacity>
    );
  }
}

Link.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
  labelStyle: PropTypes.any,
  children: PropTypes.node
};
