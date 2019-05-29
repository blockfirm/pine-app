/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Animated } from 'react-native';
import PropTypes from 'prop-types';
import AppleEasing from 'react-apple-easing';

import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import Avatar from '../Avatar';
import MessageIndicator from '../indicators/MessageIndicator';

const bubbleEndLeft = require('../../images/message/BubbleEndLeft.png');
const bubbleEndRight = require('../../images/message/BubbleEndRight.png');
const bubbleEndLeftError = require('../../images/message/BubbleEndLeftError.png');
const bubbleEndRightError = require('../../images/message/BubbleEndRightError.png');

const HEIGHT = 73;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  wrapperConnected: {
    marginBottom: 3
  },
  wrapperReceived: {
    justifyContent: 'flex-start',
    paddingLeft: 30
  },
  wrapperSent: {
    justifyContent: 'flex-end'
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 15
  },
  bubbleReceived: {
    backgroundColor: '#F0F0F0'
  },
  bubbleSent: {
    backgroundColor: '#FEC300'
  },
  bubbleError: {
    backgroundColor: '#FF3B30'
  },
  bubbleSentFirst: {
    borderBottomRightRadius: 5
  },
  bubbleReceivedFirst: {
    borderBottomLeftRadius: 5
  },
  bubbleSentLast: {
    borderTopRightRadius: 5
  },
  bubbleReceivedLast: {
    borderTopLeftRadius: 5
  },
  textReceived: {
    fontSize: 17,
    color: 'black'
  },
  textSent: {
    fontSize: 17,
    color: 'white'
  },
  textError: {
    color: 'white'
  },
  smallText: {
    fontSize: 13
  },
  smallTextReceived: {
    opacity: 0.75
  },
  smallTextSent: {
    opacity: 0.9
  },
  avatar: {
    position: 'absolute',
    bottom: 0
  },
  bubbleEnd: {
    width: 23,
    height: 25,
    position: 'absolute',
    bottom: 0
  },
  bubbleEndLeft: {
    left: -5
  },
  bubbleEndRight: {
    right: -5
  },
  indicator: {
    position: 'absolute',
    right: 10,
    bottom: 10
  }
});

export default class Message extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      animatedWrapper: new Animated.Value(0),
      animatedBubble: new Animated.Value(0)
    };
  }

  componentDidMount() {
    const { message, animate } = this.props;

    if (animate && !message.from) {
      this._animate();
    }
  }

  _animate() {
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(this.state.animatedWrapper, {
          toValue: 1,
          duration: 500,
          easing: AppleEasing.default
        }),
        Animated.timing(this.state.animatedBubble, {
          toValue: 1,
          duration: 300,
          delay: 200,
          easing: AppleEasing.default,
          useNativeDriver: true
        })
      ]).start();
    });
  }

  _applyAnimationStyles(wrapperStyle, bubbleStyle) {
    wrapperStyle.push({
      height: this.state.animatedWrapper.interpolate({
        inputRange: [0, 1],
        outputRange: [0, HEIGHT]
      })
    });

    bubbleStyle.push({
      transform: [{
        translateY: this.state.animatedBubble.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
          extrapolate: 'clamp'
        })
      }]
    });
  }

  _getFirstBubbleStyle() {
    const { message } = this.props;

    if (message.from) {
      return styles.bubbleReceivedFirst;
    }

    return styles.bubbleSentFirst;
  }

  _getLastBubbleStyle() {
    const { message } = this.props;

    if (message.from) {
      return styles.bubbleReceivedLast;
    }

    return styles.bubbleSentLast;
  }

  _renderBubbleContent(textStyle, smallTextStyle) {
    const { message } = this.props;

    return (
      <View>
        <CurrencyLabelContainer
          amountBtc={message.amountBtc}
          currencyType='primary'
          style={textStyle}
        />
        <CurrencyLabelContainer
          amountBtc={message.amountBtc}
          currencyType='secondary'
          style={[textStyle, smallTextStyle]}
        />
      </View>
    );
  }

  _renderAvatar() {
    const { message, contact, isLast } = this.props;
    const avatarChecksum = contact.avatar && contact.avatar.checksum;

    if (!message.from || !isLast) {
      return null;
    }

    return (
      <View style={styles.avatar}>
        <Avatar
          size={24}
          pineAddress={contact.address}
          checksum={avatarChecksum}
        />
      </View>
    );
  }

  _renderBubbleEnd() {
    const { message, transaction, isLast } = this.props;
    const style = message.from ? styles.bubbleEndLeft : styles.bubbleEndRight;
    let image = message.from ? bubbleEndLeft : bubbleEndRight;

    if (!isLast) {
      return null;
    }

    if (message.error || (message.canceled && !transaction)) {
      image = message.from ? bubbleEndLeftError : bubbleEndRightError;
    }

    return (
      <Image source={image} style={[styles.bubbleEnd, style]} />
    );
  }

  _renderStatus() {
    const { message, transaction } = this.props;

    return (
      <MessageIndicator
        message={message}
        transaction={transaction}
        colorStyle='light'
        style={styles.indicator}
      />
    );
  }

  // eslint-disable-next-line max-statements
  render() {
    const { message, transaction, isFirst, isLast, onPress, animate } = this.props;
    const wrapperStyle = [styles.wrapper];
    const bubbleStyle = [styles.bubble];
    const textStyle = [];
    const smallTextStyle = [styles.smallText];

    if (animate && !message.from) {
      this._applyAnimationStyles(wrapperStyle, bubbleStyle);
    }

    if (message.from) {
      wrapperStyle.push(styles.wrapperReceived);
      bubbleStyle.push(styles.bubbleReceived);
      textStyle.push(styles.textReceived);
      smallTextStyle.push(styles.smallTextReceived);
    } else {
      wrapperStyle.push(styles.wrapperSent);
      bubbleStyle.push(styles.bubbleSent);
      textStyle.push(styles.textSent);
      smallTextStyle.push(styles.smallTextSent);
    }

    if (message.error || (message.canceled && !transaction)) {
      bubbleStyle.push(styles.bubbleError);
      textStyle.push(styles.textError);
    }

    if (isFirst && !isLast) {
      wrapperStyle.push(styles.wrapperConnected);
      bubbleStyle.push(this._getFirstBubbleStyle());
    } else if (isLast && !isFirst) {
      bubbleStyle.push(this._getLastBubbleStyle());
    } else if (!isFirst && !isLast) {
      wrapperStyle.push(styles.wrapperConnected);
      bubbleStyle.push(this._getFirstBubbleStyle());
      bubbleStyle.push(this._getLastBubbleStyle());
    }

    return (
      <Animated.View style={wrapperStyle}>
        { this._renderAvatar() }
        <TouchableOpacity onPress={onPress}>
          <Animated.View style={bubbleStyle}>
            { this._renderBubbleContent(textStyle, smallTextStyle) }
            { this._renderBubbleEnd() }
            { this._renderStatus() }
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object,
  contact: PropTypes.object,
  transaction: PropTypes.object,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  onPress: PropTypes.func,
  animate: PropTypes.bool
};
