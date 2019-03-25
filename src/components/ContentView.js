import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

import getStatusBarHeight from '../utils/getStatusBarHeight';
import getNavBarHeight from '../utils/getNavBarHeight';

const styles = StyleSheet.create({
  innerView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getStatusBarHeight() + getNavBarHeight(),
    marginBottom: StaticSafeAreaInsets.safeAreaInsetsBottom,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 40,
    paddingBottom: 20
  },
  withToolbar: {
    paddingBottom: 90
  }
});

export default class ContentView extends Component {
  render() {
    const viewStyles = [
      styles.innerView,
      this.props.hasToolbar ? styles.withToolbar : null,
      this.props.style
    ];

    return (
      <View style={viewStyles}>
        {this.props.children}
      </View>
    );
  }
}

ContentView.propTypes = {
  style: PropTypes.any,
  children: PropTypes.node,
  hasToolbar: PropTypes.bool
};
