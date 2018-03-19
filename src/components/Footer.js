import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: ifIphoneX(54, 30),
    left: 40,
    right: 40
  }
});

export default class Footer extends Component {
  render() {
    return (
      <View style={[styles.footer, this.props.style]} pointerEvents={this.props.pointerEvents}>
        {this.props.children}
      </View>
    );
  }
}

Footer.propTypes = {
  style: PropTypes.any,
  pointerEvents: PropTypes.string,
  children: PropTypes.node
};
