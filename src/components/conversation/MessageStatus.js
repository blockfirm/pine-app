import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const imageGray0 = require('../../images/message/status/MessageStatusGray0.png');
const imageGray1 = require('../../images/message/status/MessageStatusGray1.png');
const imageGray2 = require('../../images/message/status/MessageStatusGray2.png');

const imageWhite0 = require('../../images/message/status/MessageStatusWhite0.png');
const imageWhite1 = require('../../images/message/status/MessageStatusWhite1.png');
const imageWhite2 = require('../../images/message/status/MessageStatusWhite2.png');

const imageError = require('../../images/message/status/MessageStatusError.png');

const COLOR_GRAY = 'gray';
const COLOR_WHITE = 'white';

const styles = StyleSheet.create({
  status: {
    position: 'absolute',
    right: 10,
    bottom: 10
  },
  icon: {
    width: 10,
    height: 10
  }
});

export default class MessageStatus extends Component {
  static STATUS_ERROR = -1;
  static STATUS_NOT_BROADCASTED = 0;
  static STATUS_PENDING_CONFIRMATION = 1;
  static STATUS_CONFIRMED = 2;

  static COLOR_GRAY = COLOR_GRAY;
  static COLOR_WHITE = COLOR_WHITE;

  static IMAGE_MAP = {
    [COLOR_GRAY]: [
      imageGray0,
      imageGray1,
      imageGray2
    ],
    [COLOR_WHITE]: [
      imageWhite0,
      imageWhite1,
      imageWhite2
    ]
  };

  _getImage() {
    const { status, color } = this.props;

    if (status === MessageStatus.STATUS_ERROR) {
      return imageError;
    }

    return MessageStatus.IMAGE_MAP[color][status];
  }

  render() {
    const image = this._getImage();

    return (
      <View style={styles.status}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

MessageStatus.propTypes = {
  status: PropTypes.oneOf([
    MessageStatus.STATUS_ERROR,
    MessageStatus.STATUS_NOT_BROADCASTED,
    MessageStatus.STATUS_PENDING_CONFIRMATION,
    MessageStatus.STATUS_CONFIRMED
  ]),
  color: PropTypes.oneOf([
    MessageStatus.COLOR_GRAY,
    MessageStatus.COLOR_WHITE
  ])
};
