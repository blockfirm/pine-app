import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import ToolbarButton from './ToolbarButton';
import SendIcon from '../icons/toolbar/SendIcon';
import TransactionsIcon from '../icons/toolbar/TransactionsIcon';
import ReceiveIcon from '../icons/toolbar/ReceiveIcon';

const WINDOW_WIDTH = Dimensions.get('window').width;
const TOOLBAR_SMALL_WIDTH = 255;
const TOOLBAR_SMALL_PADDING = (WINDOW_WIDTH - TOOLBAR_SMALL_WIDTH) / 2;
const TOOLBAR_DEFAULT_PADDING = 25;
const TOOLBAR_BUTTON_WIDTH = 50;

const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    bottom: 0,
    left: TOOLBAR_DEFAULT_PADDING,
    right: TOOLBAR_DEFAULT_PADDING,
    height: 90,
    marginBottom: ifIphoneX(24, 0),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dot: {
    width: 5,
    height: 5,
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#B1AFB7',
    borderRadius: 5
  },
  dotWhite: {
    backgroundColor: 'white',
    borderColor: '#B2AFB8',
    borderWidth: StyleSheet.hairlineWidth
  }
});

export default class Toolbar extends Component {
  _onPress(index) {
    this.props.onPress(index);
  }

  _getPositionStyle() {
    const contentOffsetX = this.props.contentOffsetX;
    let progress = 0;

    const style = {
      left: TOOLBAR_DEFAULT_PADDING,
      right: TOOLBAR_DEFAULT_PADDING
    };

    if (contentOffsetX < WINDOW_WIDTH) {
      progress = (WINDOW_WIDTH - contentOffsetX) / WINDOW_WIDTH;
    }

    if (contentOffsetX > WINDOW_WIDTH) {
      progress = (contentOffsetX - WINDOW_WIDTH) / WINDOW_WIDTH;
    }

    style.left += (TOOLBAR_SMALL_PADDING - TOOLBAR_DEFAULT_PADDING) * progress;
    style.right = style.left;

    return style;
  }

  _getSendButtonWhiteOpacity(positionStyle) {
    const contentOffsetX = this.props.contentOffsetX;
    const screenPosition = WINDOW_WIDTH - contentOffsetX;
    const start = positionStyle.left;
    const end = start + TOOLBAR_BUTTON_WIDTH;

    if (screenPosition >= start) {
      const opacity = (screenPosition - start) / (end - start);
      return opacity > 1 ? 1 : opacity;
    }

    return 0;
  }

  _getTransactionsButtonWhiteOpacity() {
    const contentOffsetX = this.props.contentOffsetX;
    const screenPosition = WINDOW_WIDTH - contentOffsetX;
    const start = WINDOW_WIDTH / 2 - TOOLBAR_BUTTON_WIDTH / 2;
    const end = start + TOOLBAR_BUTTON_WIDTH;

    if (screenPosition >= start) {
      const opacity = (screenPosition - start) / (end - start);
      return opacity > 1 ? 1 : opacity;
    }

    return 0;
  }

  _getReceiveButtonWhiteOpacity(positionStyle) {
    const contentOffsetX = this.props.contentOffsetX;
    const screenPosition = WINDOW_WIDTH - contentOffsetX;
    const start = WINDOW_WIDTH - positionStyle.right - TOOLBAR_BUTTON_WIDTH;
    const end = start + TOOLBAR_BUTTON_WIDTH;

    if (screenPosition >= start) {
      const opacity = (screenPosition - start) / (end - start);
      return opacity > 1 ? 1 : opacity;
    }

    return 0;
  }

  _getDotPosition(positionStyle) {
    const contentOffsetX = this.props.contentOffsetX;
    const screenPosition = contentOffsetX - WINDOW_WIDTH;
    const defaultDotPosition = (WINDOW_WIDTH / 2) - 1.5 - positionStyle.left;

    const dotOffset = (WINDOW_WIDTH / 2) - TOOLBAR_SMALL_PADDING - (TOOLBAR_BUTTON_WIDTH / 2) + 1.5;
    const progress = (-screenPosition) / WINDOW_WIDTH;
    const dotPosition = defaultDotPosition - (dotOffset * progress);

    return dotPosition;
  }

  _getDotStyle(positionStyle, dotPosition) {
    const contentOffsetX = this.props.contentOffsetX;
    const screenPosition = WINDOW_WIDTH - contentOffsetX;

    if (screenPosition > dotPosition + positionStyle.left + 5) {
      return styles.dotWhite;
    }

    return null;
  }

  _renderDot(positionStyle) {
    const dotPosition = this._getDotPosition(positionStyle);
    const dotStyle = this._getDotStyle(positionStyle, dotPosition);

    return (
      <View style={[styles.dot, { left: dotPosition }, dotStyle]} />
    );
  }

  render() {
    const positionStyle = this._getPositionStyle();
    const sendButtonWhiteOpacity = this._getSendButtonWhiteOpacity(positionStyle);
    const transactionsButtonWhiteOpacity = this._getTransactionsButtonWhiteOpacity();
    const receiveButtonWhiteOpacity = this._getReceiveButtonWhiteOpacity(positionStyle);

    return (
      <View style={[styles.toolbar, positionStyle]}>
        <ToolbarButton Icon={SendIcon} onPress={this._onPress.bind(this, 0)} whiteOpacity={sendButtonWhiteOpacity} />
        <ToolbarButton Icon={TransactionsIcon} onPress={this._onPress.bind(this, 1)} whiteOpacity={transactionsButtonWhiteOpacity} />
        <ToolbarButton Icon={ReceiveIcon} onPress={this._onPress.bind(this, 2)} whiteOpacity={receiveButtonWhiteOpacity} />

        {this._renderDot(positionStyle)}
      </View>
    );
  }
}

Toolbar.propTypes = {
  onPress: PropTypes.func.isRequired,
  contentOffsetX: PropTypes.number
};
