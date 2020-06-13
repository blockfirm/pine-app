import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const IMAGE_LIGHT = require('../../images/indicators/WarningLightningIndicatorLight.png');
const IMAGE_DARK = require('../../images/indicators/WarningLightningIndicatorDark.png');

const styles = StyleSheet.create({
  image: {
    width: 11,
    height: 14
  }
});

class WarningLightningIndicator extends Component {
  render() {
    const { style, theme } = this.props;
    const image = theme.name === 'dark' ? IMAGE_DARK : IMAGE_LIGHT;

    return (
      <Image source={image} style={[styles.image, style]} />
    );
  }
}

WarningLightningIndicator.propTypes = {
  style: PropTypes.any,
  theme: PropTypes.object
};

export default withTheme(WarningLightningIndicator);
