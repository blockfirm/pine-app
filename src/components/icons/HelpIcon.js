import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    width: 13,
    height: 13
  }
});

export default class HelpIcon extends Component {
  render() {
    const image = require('../../images/icons/Help.png');

    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

HelpIcon.propTypes = {
  style: PropTypes.any
};
