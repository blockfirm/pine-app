import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 9,
    borderWidth: 1
  },
  badge: {
    width: 16,
    height: 16
  }
});

class LightningBadge extends Component {
  render() {
    const { style, theme } = this.props;

    const wrapperStyle = [
      styles.wrapper,
      { borderColor: theme.palette.background },
      style
    ];

    return (
      <View style={wrapperStyle}>
        <Image source={theme.lightningBadgeImage} style={styles.badge} />
      </View>
    );
  }
}

LightningBadge.propTypes = {
  style: PropTypes.any,
  theme: PropTypes.object
};

export default withTheme(LightningBadge);
