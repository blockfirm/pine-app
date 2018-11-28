import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const WINDOW_WIDTH = Dimensions.get('window').width;
const MAX_FONT_SIZE = 70;
const FONT_RESIZE_FACTOR = 0.75;
const DEFAULT_MARGIN = 100;

const styles = StyleSheet.create({
  view: {
    alignSelf: 'stretch'
  },
  text: {
    fontSize: MAX_FONT_SIZE
  }
});

export default class AutoFontSize extends Component {
  static MAX_FONT_SIZE = MAX_FONT_SIZE;

  state = {
    fontSize: MAX_FONT_SIZE
  }

  constructor() {
    super(...arguments);
    this._onLayout = this._onLayout.bind(this);
  }

  _getMargin() {
    const { margin } = this.props;

    if (margin === undefined) {
      return DEFAULT_MARGIN;
    }

    return margin;
  }

  /**
   * Automatically changes the font size when the content grows.
   */
  _onLayout(event) {
    const { width } = event.nativeEvent.layout;
    const { onFontResize } = this.props;
    let { fontSize } = this.state;
    const margin = this._getMargin();

    if (width > WINDOW_WIDTH - margin) {
      fontSize = Math.floor(this.state.fontSize * FONT_RESIZE_FACTOR);
    } else if (width < WINDOW_WIDTH - margin * 2) {
      fontSize = Math.ceil(this.state.fontSize / FONT_RESIZE_FACTOR);
    }

    this.setState({
      fontSize: Math.min(fontSize, MAX_FONT_SIZE)
    });

    if (onFontResize) {
      onFontResize(this.state.fontSize);
    }
  }

  render() {
    const { fontSize } = this.state;

    const textStyles = [
      styles.text,
      this.props.style,
      { fontSize }
    ];

    return (
      <View style={[styles.view, this.props.containerStyle]} onLayout={this._onLayout}>
        <Text style={textStyles} numberOfLines={1}>
          {this.props.children}
        </Text>
      </View>
    );
  }
}

AutoFontSize.propTypes = {
  style: PropTypes.any,
  containerStyle: PropTypes.any,
  onFontResize: PropTypes.func,
  margin: PropTypes.number,
  children: PropTypes.node
};
