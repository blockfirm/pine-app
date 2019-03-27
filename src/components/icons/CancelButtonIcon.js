import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const image = require('../../images/icons/CancelButtonIcon.png');

const styles = StyleSheet.create({
  icon: {
    width: 8,
    height: 9
  }
});

export default class SendButtonIcon extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

SendButtonIcon.propTypes = {
  style: PropTypes.any
};
