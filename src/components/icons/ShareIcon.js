import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    width: 18,
    height: 27
  }
});

export default class ShareIcon extends Component {
  render() {
    const image = require('../../images/icons/Share.png');

    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

ShareIcon.propTypes = {
  style: PropTypes.any
};
