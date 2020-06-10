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
    require('../../images/indicators/ReceivedLightningIndicator0.png'),
    require('../../images/indicators/ReceivedLightningIndicator1.png'),
    require('../../images/indicators/ReceivedLightningIndicator2.png')
  ],
  [COLOR_STYLE_LIGHT]: [
    require('../../images/indicators/ReceivedLightningIndicatorLight0.png'),
    require('../../images/indicators/ReceivedLightningIndicatorLight1.png'),
    require('../../images/indicators/ReceivedLightningIndicatorLight2.png')
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
    require('../../images/indicators/ReceivedLightningIndicatorDark0.png'),
    require('../../images/indicators/ReceivedLightningIndicatorDark1.png'),
    require('../../images/indicators/ReceivedLightningIndicatorDark2.png')
  ],
  [COLOR_STYLE_LIGHT]: [
    require('../../images/indicators/ReceivedLightningIndicatorLightDark0.png'),
    require('../../images/indicators/ReceivedLightningIndicatorLightDark1.png'),
    require('../../images/indicators/ReceivedLightningIndicatorLightDark2.png')
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

class ReceivedLightningIndicator extends Component {
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

ReceivedLightningIndicator.propTypes = {
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

ReceivedLightningIndicator.defaultProps = {
  colorStyle: COLOR_STYLE_COLOR
};

export default withTheme(ReceivedLightningIndicator);
