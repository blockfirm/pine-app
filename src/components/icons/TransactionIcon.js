import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    width: 19,
    height: 20
  }
});

const TYPE_RECEIVE_STAGE_1 = 'RECEIVE_STAGE_1';
const TYPE_RECEIVE_STAGE_2 = 'RECEIVE_STAGE_2';
const TYPE_RECEIVE_STAGE_3 = 'RECEIVE_STAGE_3';
const TYPE_SEND_STAGE_1 = 'SEND_STAGE_1';
const TYPE_SEND_STAGE_2 = 'SEND_STAGE_2';
const TYPE_SEND_STAGE_3 = 'SEND_STAGE_3';

const IMAGES = {
  [TYPE_RECEIVE_STAGE_1]: require('../../images/icons/ReceiveStage1.png'),
  [TYPE_RECEIVE_STAGE_2]: require('../../images/icons/ReceiveStage2.png'),
  [TYPE_RECEIVE_STAGE_3]: require('../../images/icons/ReceiveStage3.png'),
  [TYPE_SEND_STAGE_1]: require('../../images/icons/SendStage1.png'),
  [TYPE_SEND_STAGE_2]: require('../../images/icons/SendStage2.png'),
  [TYPE_SEND_STAGE_3]: require('../../images/icons/SendStage3.png')
};

export default class TransactionIcon extends Component {
  static TYPE_RECEIVE_STAGE_1 = TYPE_RECEIVE_STAGE_1;
  static TYPE_RECEIVE_STAGE_2 = TYPE_RECEIVE_STAGE_2;
  static TYPE_RECEIVE_STAGE_3 = TYPE_RECEIVE_STAGE_3;
  static TYPE_SEND_STAGE_1 = TYPE_SEND_STAGE_1;
  static TYPE_SEND_STAGE_2 = TYPE_SEND_STAGE_2;
  static TYPE_SEND_STAGE_3 = TYPE_SEND_STAGE_3;

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
