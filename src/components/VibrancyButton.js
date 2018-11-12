import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight, Dimensions, Text } from 'react-native';
import PropTypes from 'prop-types';
import { VibrancyView } from 'react-native-blur';

const windowDimensions = Dimensions.get('window');
const FULL_WIDTH = windowDimensions.width;
const DEFAULT_WIDTH = FULL_WIDTH - 80;

const PRESS_FREEZE_MS = 1000; // Don't allow another press until 1s after the previous press.

const styles = StyleSheet.create({
  button: {
    width: DEFAULT_WIDTH,
    height: 50,
    borderRadius: 25
  },
  labelWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    color: 'black',
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: -0.41
  }
});

export default class VibrancyButton extends Component {
  constructor() {
    super(...arguments);
    this._onPress = this._onPress.bind(this);
  }

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
    const buttonStyles = [
      styles.button,
      this.props.style
    ];

    return (
      <TouchableHighlight onPress={this._onPress} underlayColor='rgba(0, 0, 0, 0.2)' activeOpacity={1} style={buttonStyles}>
        <View>
          <VibrancyView blurType='light' blurAmount={100} style={buttonStyles} />
          <View style={styles.labelWrapper}>
            <Text style={[styles.label, this.props.labelStyle]}>
              {this.props.label}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

VibrancyButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
  labelStyle: PropTypes.any
};
