import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const messageStatusGray0 = require('../../images/message/status/MessageStatusGray0.png');
const messageStatusGray1 = require('../../images/message/status/MessageStatusGray1.png');
const messageStatusGray2 = require('../../images/message/status/MessageStatusGray2.png');

const messageStatusWhite0 = require('../../images/message/status/MessageStatusWhite0.png');
const messageStatusWhite1 = require('../../images/message/status/MessageStatusWhite1.png');
const messageStatusWhite2 = require('../../images/message/status/MessageStatusWhite2.png');

const COLOR_GRAY = 'gray';
const COLOR_WHITE = 'white';

const IMAGES = {
  [COLOR_GRAY]: [
    messageStatusGray0,
    messageStatusGray1,
    messageStatusGray2
  ],
  [COLOR_WHITE]: [
    messageStatusWhite0,
    messageStatusWhite1,
    messageStatusWhite2
  ]
};

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
  render() {
    const { status, color } = this.props;
    const image = IMAGES[color][status];

    return (
      <View style={styles.status}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

MessageStatus.propTypes = {
  status: PropTypes.oneOf([0, 1, 2]),
  color: PropTypes.oneOf([COLOR_GRAY, COLOR_WHITE])
};
