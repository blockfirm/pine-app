import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const COLOR_STYLE_COLOR = 'color';
const COLOR_STYLE_LIGHT = 'light';

const IMAGES_LIGHT = {
  [COLOR_STYLE_COLOR]: require('../../images/indicators/CanceledIndicator.png'),
  [COLOR_STYLE_LIGHT]: require('../../images/indicators/CanceledIndicatorLight.png')
};

const IMAGES_DARK = {
  [COLOR_STYLE_COLOR]: require('../../images/indicators/CanceledIndicatorDark.png'),
  [COLOR_STYLE_LIGHT]: require('../../images/indicators/CanceledIndicatorLightDark.png')
};

const styles = StyleSheet.create({
  image: {
    width: 10,
    height: 10
  }
});

class CanceledIndicator extends Component {
  render() {
    const { style, colorStyle, theme } = this.props;
    const images = theme.name === 'dark' ? IMAGES_DARK : IMAGES_LIGHT;
    const image = images[colorStyle];

    return (
      <View style={style}>
        <Image source={image} style={styles.image} />
      </View>
    );
  }
}

CanceledIndicator.propTypes = {
  style: PropTypes.any,
  colorStyle: PropTypes.oneOf([COLOR_STYLE_COLOR, COLOR_STYLE_LIGHT]),
  theme: PropTypes.object.isRequired
};

CanceledIndicator.defaultProps = {
  colorStyle: COLOR_STYLE_COLOR
};

export default withTheme(CanceledIndicator);
