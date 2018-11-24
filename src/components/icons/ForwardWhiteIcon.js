import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 37
  }
});

export default class ForwardWhiteIcon extends Component {
  render() {
    const image = require('../../images/icons/ForwardWhite.png');

    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

ForwardWhiteIcon.propTypes = {
  style: PropTypes.any
};
