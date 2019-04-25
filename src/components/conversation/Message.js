import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';

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
  }
});

export default class Message extends Component {
  render() {
    const { message } = this.props;

    const bubbleStyle = [
      styles.bubble,
      message.from ? styles.received : styles.sent
    ];

    const textStyle = message.from ? styles.receivedText : styles.sentText;

    return (
      <View style={bubbleStyle}>
        <CurrencyLabelContainer
          amountBtc={message.amount / 100000000}
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
