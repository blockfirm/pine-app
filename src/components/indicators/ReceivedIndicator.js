import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const IMAGES = [
  require('../../images/indicators/ReceivedIndicator0.png'),
  require('../../images/indicators/ReceivedIndicator1.png'),
  require('../../images/indicators/ReceivedIndicator2.png')
];

const styles = StyleSheet.create({
  image: {
    width: 9,
    height: 10
  }
});

export default class ReceivedIndicator extends Component {
  render() {
    const { status, style } = this.props;
    const image = IMAGES[status];

    return (
      <View style={style}>
        <Image source={image} style={styles.image} />
      </View>
    );
  }
}

ReceivedIndicator.propTypes = {
  style: PropTypes.any,
  status: PropTypes.number
};
