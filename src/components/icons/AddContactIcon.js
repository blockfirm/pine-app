import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const image = require('../../images/icons/AddContact.png');

const styles = StyleSheet.create({
  icon: {
    width: 29,
    height: 27
  }
});

export default class AddContactIcon extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

AddContactIcon.propTypes = {
  style: PropTypes.any
};
