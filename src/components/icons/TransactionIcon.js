import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    width: 19,
    height: 20
  }
});

const TYPE_RECEIVING = 'RECEIVING';
const TYPE_RECEIVED = 'RECEIVED';
const TYPE_SENDING = 'SENDING';
const TYPE_SENT = 'SENT';

const IMAGES = {
  [TYPE_RECEIVING]: require('../../images/icons/Receiving.png'),
  [TYPE_RECEIVED]: require('../../images/icons/Received.png'),
  [TYPE_SENDING]: require('../../images/icons/Sending.png'),
  [TYPE_SENT]: require('../../images/icons/Sent.png')
};

export default class TransactionIcon extends Component {
  static TYPE_RECEIVING = TYPE_RECEIVING;
  static TYPE_RECEIVED = TYPE_RECEIVED;
  static TYPE_SENDING = TYPE_SENDING;
  static TYPE_SENT = TYPE_SENT;

  render() {
    const image = IMAGES[this.props.type];

    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

TransactionIcon.propTypes = {
  style: PropTypes.any,
  type: PropTypes.string.isRequired
};
