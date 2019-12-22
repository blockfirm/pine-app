import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { withTheme } from '../contexts/theme';

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: StaticSafeAreaInsets.safeAreaInsetsBottom,
    left: 40,
    right: 40,
    paddingBottom: ifIphoneX(20, 30)
  },
  withToolbar: {
    marginBottom: 90
  }
});

class Footer extends Component {
  render() {
    const { children, hasToolbar, style, pointerEvents, theme } = this.props;

    const toolbarStyles = [
      styles.footer,
      theme.background,
      hasToolbar ? styles.withToolbar : null,
      style
    ];

    return (
      <View style={toolbarStyles} pointerEvents={pointerEvents}>
        {children}
      </View>
    );
  }
}

Footer.propTypes = {
  style: PropTypes.any,
  pointerEvents: PropTypes.string,
  children: PropTypes.node,
  hasToolbar: PropTypes.bool,
  theme: PropTypes.object.isRequired
};

export default withTheme(Footer);
