/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import Avatar from '../Avatar';
import StyledText from '../StyledText';
import MessageStatus from './MessageStatus';

const bubbleEndLeft = require('../../images/message/BubbleEndLeft.png');
const bubbleEndRight = require('../../images/message/BubbleEndRight.png');
const bubbleEndLeftError = require('../../images/message/BubbleEndLeftError.png');
const bubbleEndRightError = require('../../images/message/BubbleEndRightError.png');

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
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
  bubbleFirst: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  bubbleLast: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
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
    fontSize: 14,
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
  }
});

export default class Message extends Component {
  _getStatus() {
    const { transaction } = this.props;

    if (!transaction) {
      return 0; // Not Broadcasted
    }

    if (!transaction.confirmations > 0) {
      return 1; // Pending Confirmation
    }

    return 2; // Confirmed
  }

  _renderContent(textStyle, smallTextStyle) {
    const { message } = this.props;

    if (message.error) {
      return (
        <StyledText style={textStyle}>
          {message.error}
        </StyledText>
      );
    }

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
    const { message, isLast } = this.props;
    const style = message.from ? styles.bubbleEndLeft : styles.bubbleEndRight;
    let image = message.from ? bubbleEndLeft : bubbleEndRight;

    if (!isLast) {
      return null;
    }

    if (message.error) {
      image = message.from ? bubbleEndLeftError : bubbleEndRightError;
    }

    return (
      <Image source={image} style={[styles.bubbleEnd, style]} />
    );
  }

  _renderStatus() {
    const { message } = this.props;
    const color = message.from ? 'gray' : 'white';

    return (
      <MessageStatus status={this._getStatus()} color={color} />
    );
  }

  // eslint-disable-next-line max-statements
  render() {
    const { message, isFirst, isLast, onPress } = this.props;
    const wrapperStyle = [styles.wrapper];
    const bubbleStyle = [styles.bubble];
    const textStyle = [];
    const smallTextStyle = [styles.smallText];

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

    if (message.error) {
      bubbleStyle.push(styles.bubbleError);
      textStyle.push(styles.textError);
    }

    if (isFirst && !isLast) {
      bubbleStyle.push(styles.bubbleFirst);
    } else if (isLast && !isFirst) {
      bubbleStyle.push(styles.bubbleLast);
    } else if (!isFirst && !isLast) {
      bubbleStyle.push(styles.bubbleFirst);
      bubbleStyle.push(styles.bubbleLast);
    }

    return (
      <View style={wrapperStyle}>
        { this._renderAvatar() }
        <TouchableOpacity style={bubbleStyle} onPress={onPress}>
          { this._renderContent(textStyle, smallTextStyle) }
          { this._renderBubbleEnd() }
          { this._renderStatus() }
        </TouchableOpacity>
      </View>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object,
  contact: PropTypes.object,
  transaction: PropTypes.object,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  onPress: PropTypes.func
};
