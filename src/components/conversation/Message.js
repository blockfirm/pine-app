import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import StyledText from '../StyledText';

const styles = StyleSheet.create({
  bubble: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 10
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0'
  },
  receivedText: {
    color: 'black'
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD23F'
  },
  sentText: {
    color: 'white'
  },
  error: {
    backgroundColor: '#FF3B30'
  },
  errorText: {
    color: 'white'
  }
});

export default class Message extends Component {
  _getBubbleStyle() {
    const { message } = this.props;

    return [
      styles.bubble,
      message.from ? styles.received : styles.sent
    ];
  }

  _getTextStyle() {
    const { message } = this.props;
    return message.from ? styles.receivedText : styles.sentText;
  }

  _renderError() {
    const { error } = this.props.message;
    const bubbleStyle = this._getBubbleStyle();

    return (
      <View style={[bubbleStyle, styles.error]}>
        <StyledText style={styles.errorText}>
          {error}
        </StyledText>
      </View>
    );
  }

  render() {
    const { message } = this.props;

    if (message.error) {
      return this._renderError(message.error);
    }

    const bubbleStyle = this._getBubbleStyle();
    const textStyle = this._getTextStyle();

    return (
      <View style={bubbleStyle}>
        <CurrencyLabelContainer
          amountBtc={message.amountBtc}
          currencyType='primary'
          style={textStyle}
        />
      </View>
    );
  }
}

Message.propTypes = {
  message: PropTypes.object
};
