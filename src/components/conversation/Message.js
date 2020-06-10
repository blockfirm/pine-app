/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Animated } from 'react-native';
import PropTypes from 'prop-types';
import AppleEasing from 'react-apple-easing';

import { satsToBtc } from '../../crypto/bitcoin/convert';
import { withTheme } from '../../contexts/theme';
import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import Avatar from '../Avatar';
import MessageIndicator from '../indicators/MessageIndicator';
import CardMessage from './CardMessage';

const MESSAGE_HEIGHT = 73;
const CARD_MESSAGE_HEIGHT = CardMessage.getHeight();

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
    fontSize: 17
  },
  textSent: {
    fontSize: 17
  },
  smallText: {
    fontSize: 13
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

class Message extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      animatedBubble: new Animated.Value(0)
    };
  }

  componentDidMount() {
    const { animate } = this.props;

    if (animate) {
      this._animate();
    }
  }

  _animate() {
    Animated.timing(this.state.animatedBubble, {
      toValue: 1,
      duration: 450,
      easing: AppleEasing.easeOut,
      useNativeDriver: true
    }).start();
  }

  _applyAnimationStyles(wrapperStyle) {
    const height = this._hasCard() ? CARD_MESSAGE_HEIGHT : MESSAGE_HEIGHT;

    wrapperStyle.push({
      transform: [{
        translateY: this.state.animatedBubble.interpolate({
          inputRange: [0, 1],
          outputRange: [height, 0],
          extrapolate: 'clamp'
        })
      }]
    });
  }

  _hasError() {
    const { message, transaction, invoice } = this.props;
    return message.error || (invoice && invoice.redeemError) || (message.canceled && !transaction);
  }

  _hasCard() {
    const { message } = this.props;
    return Boolean(message.data.card);
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
    const { message, invoice } = this.props;
    const amountBtc = invoice ? satsToBtc(invoice.paidAmount) : message.amountBtc;

    return (
      <View>
        <CurrencyLabelContainer
          amountBtc={amountBtc}
          currencyType='primary'
          style={textStyle}
        />
        <CurrencyLabelContainer
          amountBtc={amountBtc}
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
          vendorId={contact.vendorId}
          checksum={avatarChecksum}
        />
      </View>
    );
  }

  _renderBubbleEnd() {
    const { message, isLast, theme } = this.props;
    const style = message.from ? styles.bubbleEndLeft : styles.bubbleEndRight;
    let image = message.from ? theme.bubbleEndLeft : theme.bubbleEndRight;

    if (!isLast) {
      return null;
    }

    if (this._hasError()) {
      image = message.from ? theme.bubbleEndLeftError : theme.bubbleEndRightError;
    }

    return (
      <Image source={image} style={[styles.bubbleEnd, style]} />
    );
  }

  _renderStatus() {
    const { message, transaction, invoice } = this.props;

    return (
      <MessageIndicator
        message={message}
        transaction={transaction}
        invoice={invoice}
        colorStyle='light'
        style={styles.indicator}
      />
    );
  }

  _renderStandardMessage(bubbleStyle, textStyle, smallTextStyle) {
    const { onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        <Animated.View style={bubbleStyle}>
          { this._renderBubbleContent(textStyle, smallTextStyle) }
          { this._renderBubbleEnd() }
          { this._renderStatus() }
        </Animated.View>
      </TouchableOpacity>
    );
  }

  _renderCardMessage(textStyle) {
    const { message, transaction, invoice, onPress } = this.props;
    const hasError = this._hasError();

    return (
      <CardMessage
        message={message}
        transaction={transaction}
        invoice={invoice}
        onPress={onPress}
        textStyle={textStyle}
        hasError={hasError}
      />
    );
  }

  // eslint-disable-next-line max-statements
  render() {
    const { message, isFirst, isLast, animate, theme } = this.props;
    const wrapperStyle = [styles.wrapper];
    const bubbleStyle = [styles.bubble];
    const textStyle = [];
    const smallTextStyle = [styles.smallText];
    const hasCard = this._hasCard();

    if (animate) {
      this._applyAnimationStyles(wrapperStyle);
    }

    if (message.from) {
      wrapperStyle.push(styles.wrapperReceived);
      bubbleStyle.push(theme.bubbleReceived);
      textStyle.push(styles.textReceived);
      textStyle.push(theme.bubbleReceivedText);
      smallTextStyle.push(theme.bubbleReceivedTextSmall);
    } else {
      wrapperStyle.push(styles.wrapperSent);
      bubbleStyle.push(theme.bubbleSent);
      textStyle.push(styles.textSent);
      textStyle.push(theme.bubbleSentText);
      smallTextStyle.push(theme.bubbleSentTextSmall);
    }

    if (this._hasError()) {
      bubbleStyle.push(theme.bubbleError);
      textStyle.push(theme.bubbleErrorText);
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
        { !hasCard && this._renderStandardMessage(bubbleStyle, textStyle, smallTextStyle) }
        { hasCard && this._renderCardMessage(textStyle) }
      </Animated.View>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object,
  contact: PropTypes.object,
  transaction: PropTypes.object,
  invoice: PropTypes.object,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  onPress: PropTypes.func,
  animate: PropTypes.bool,
  theme: PropTypes.object.isRequired
};

export default withTheme(Message);
