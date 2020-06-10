import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const COLOR_STYLE_COLOR = 'color';
const COLOR_STYLE_LIGHT = 'light';
const COLOR_STYLE_WHITE = 'white';
const COLOR_STYLE_BLACK = 'black';

const IMAGES_LIGHT = {
  [COLOR_STYLE_COLOR]: [
    require('../../images/indicators/SentLightningIndicator0.png'),
    require('../../images/indicators/SentLightningIndicator1.png'),
    require('../../images/indicators/SentLightningIndicator2.png')
  ],
  [COLOR_STYLE_LIGHT]: [
    require('../../images/indicators/SentLightningIndicatorLight0.png'),
    require('../../images/indicators/SentLightningIndicatorLight1.png'),
    require('../../images/indicators/SentLightningIndicatorLight2.png')
  ],
  [COLOR_STYLE_WHITE]: [
    require('../../images/indicators/ReceivedLightningIndicatorLightDark0.png'),
    require('../../images/indicators/ReceivedLightningIndicatorLightDark1.png'),
    require('../../images/indicators/ReceivedLightningIndicatorLightDark2.png')
  ],
  [COLOR_STYLE_BLACK]: [
    require('../../images/indicators/SentLightningIndicatorBlack0.png'),
    require('../../images/indicators/SentLightningIndicatorBlack1.png'),
    require('../../images/indicators/SentLightningIndicatorBlack2.png')
  ]
};

const IMAGES_DARK = {
  [COLOR_STYLE_COLOR]: [
    require('../../images/indicators/SentLightningIndicatorDark0.png'),
    require('../../images/indicators/SentLightningIndicatorDark1.png'),
    require('../../images/indicators/SentLightningIndicatorDark2.png')
  ],
  [COLOR_STYLE_LIGHT]: [
    require('../../images/indicators/SentLightningIndicatorLightDark0.png'),
    require('../../images/indicators/SentLightningIndicatorLightDark1.png'),
    require('../../images/indicators/SentLightningIndicatorLightDark2.png')
  ],
  [COLOR_STYLE_WHITE]: [
    require('../../images/indicators/ReceivedLightningIndicatorLightDark0.png'),
    require('../../images/indicators/ReceivedLightningIndicatorLightDark1.png'),
    require('../../images/indicators/ReceivedLightningIndicatorLightDark2.png')
  ],
  [COLOR_STYLE_BLACK]: [
    require('../../images/indicators/SentLightningIndicatorBlack0.png'),
    require('../../images/indicators/SentLightningIndicatorBlack1.png'),
    require('../../images/indicators/SentLightningIndicatorBlack2.png')
  ]
};

const styles = StyleSheet.create({
  image: {
    width: 9,
    height: 12
  }
});

class SentLightningIndicator extends Component {
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

SentLightningIndicator.propTypes = {
  style: PropTypes.any,
  colorStyle: PropTypes.oneOf([
    COLOR_STYLE_COLOR,
    COLOR_STYLE_LIGHT,
    COLOR_STYLE_WHITE,
    COLOR_STYLE_BLACK
  ]),
  status: PropTypes.oneOf([0, 1, 2]),
  theme: PropTypes.object.isRequired
};

SentLightningIndicator.defaultProps = {
  colorStyle: COLOR_STYLE_COLOR
};

export default withTheme(SentLightningIndicator);
