import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const COLOR_STYLE_COLOR = 'color';
const COLOR_STYLE_LIGHT = 'light';

const IMAGES_LIGHT = {
  [COLOR_STYLE_COLOR]: [
    require('../../images/indicators/SentIndicator0.png'),
    require('../../images/indicators/SentIndicator1.png'),
    require('../../images/indicators/SentIndicator2.png')
  ],
  [COLOR_STYLE_LIGHT]: [
    require('../../images/indicators/SentIndicatorLight0.png'),
    require('../../images/indicators/SentIndicatorLight1.png'),
    require('../../images/indicators/SentIndicatorLight2.png')
  ]
};

const IMAGES_DARK = {
  [COLOR_STYLE_COLOR]: [
    require('../../images/indicators/SentIndicatorDark0.png'),
    require('../../images/indicators/SentIndicatorDark1.png'),
    require('../../images/indicators/SentIndicatorDark2.png')
  ],
  [COLOR_STYLE_LIGHT]: [
    require('../../images/indicators/SentIndicatorLightDark0.png'),
    require('../../images/indicators/SentIndicatorLightDark1.png'),
    require('../../images/indicators/SentIndicatorLightDark2.png')
  ]
};

const styles = StyleSheet.create({
  image: {
    width: 9,
    height: 10
  }
});

class SentIndicator extends Component {
  render() {
    const { status, style, colorStyle, theme } = this.props;
    const images = theme.name === 'dark' ? IMAGES_DARK : IMAGES_LIGHT;
    const image = images[colorStyle][status];

    return (
      <View style={style}>
        <Image source={image} style={styles.image} />
      </View>
    );
  }
}

SentIndicator.propTypes = {
  style: PropTypes.any,
  colorStyle: PropTypes.oneOf([COLOR_STYLE_COLOR, COLOR_STYLE_LIGHT]),
  status: PropTypes.oneOf([0, 1, 2]),
  theme: PropTypes.object.isRequired
};

SentIndicator.defaultProps = {
  colorStyle: COLOR_STYLE_COLOR
};

export default withTheme(SentIndicator);
