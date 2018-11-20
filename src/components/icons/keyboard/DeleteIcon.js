import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    width: 23,
    height: 18
  }
});

export default class DeleteIcon extends Component {
  render() {
    const image = require('../../../images/icons/keyboard/Delete.png');

    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

DeleteIcon.propTypes = {
  style: PropTypes.any
};
