import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import ShareIcon from '../components/icons/ShareIcon';
import getStatusBarHeight from '../utils/getStatusBarHeight';
import getNavBarHeight from '../utils/getNavBarHeight';

const styles = StyleSheet.create({
  header: {
    marginTop: getStatusBarHeight(),
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: getNavBarHeight(),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  share: {
    position: 'absolute',
    top: 4,
    right: 15.5,
    padding: 5 // The padding makes it easier to press.
  }
});

export default class ReceiveScreenHeader extends Component {
  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={this.props.onSharePress} style={styles.share}>
          <ShareIcon />
        </TouchableOpacity>
      </View>
    );
  }
}

ReceiveScreenHeader.propTypes = {
  onSharePress: PropTypes.func
};
