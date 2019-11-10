import React, { Component } from 'react';
import { StyleSheet, View, Animated, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  iconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50
  },
  icon: {
    position: 'absolute'
  }
});

export default class ToolbarButton extends Component {
  constructor() {
    super(...arguments);

    this._onPressIn = this._onPressIn.bind(this);
    this._onPressOut = this._onPressOut.bind(this);
  }

  UNSAFE_componentWillMount() {
    this._scale = new Animated.Value(1);
  }

  _onPressIn() {
    Animated.spring(this._scale, {
      toValue: 1.3,
      speed: 30,
      useNativeDriver: true
    }).start();
  }

  _onPressOut() {
    Animated.spring(this._scale, {
      toValue: 1,
      speed: 30,
      useNativeDriver: true
    }).start();
  }

  render() {
    const whiteOpacity = this.props.whiteOpacity || 0;
    const whiteIconStyle = { opacity: whiteOpacity };
    const defaultIconStyle = { opacity: 1 - whiteOpacity };

    const scaleStyle = {
      transform: [{ scale: this._scale }]
    };

    return (
      <View>
        <TouchableWithoutFeedback
          onPressIn={this._onPressIn}
          onPressOut={this._onPressOut}
          onPress={this.props.onPress}
        >
          <Animated.View style={[styles.iconWrapper, scaleStyle]}>
            <this.props.Icon style={[styles.icon, defaultIconStyle]} />
            <this.props.Icon style={[styles.icon, whiteIconStyle]} white={true} />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

ToolbarButton.propTypes = {
  Icon: PropTypes.any.isRequired,
  onPress: PropTypes.func,
  whiteOpacity: PropTypes.number
};
