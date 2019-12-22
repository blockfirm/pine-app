import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const COLOR_STYLE_COLOR = 'color';
const COLOR_STYLE_LIGHT = 'light';

const IMAGES_LIGHT = {
  [COLOR_STYLE_COLOR]: [
    require('../../images/indicators/ReceivedIndicator0.png'),
    require('../../images/indicators/ReceivedIndicator1.png'),
    require('../../images/indicators/ReceivedIndicator2.png')
  ],
  [COLOR_STYLE_LIGHT]: [
    require('../../images/indicators/ReceivedIndicatorLight0.png'),
    require('../../images/indicators/ReceivedIndicatorLight1.png'),
    require('../../images/indicators/ReceivedIndicatorLight2.png')
  ]
};

const IMAGES_DARK = {
  [COLOR_STYLE_COLOR]: [
    require('../../images/indicators/ReceivedIndicatorDark0.png'),
    require('../../images/indicators/ReceivedIndicatorDark1.png'),
    require('../../images/indicators/ReceivedIndicatorDark2.png')
  ],
  [COLOR_STYLE_LIGHT]: [
    require('../../images/indicators/ReceivedIndicatorLightDark0.png'),
    require('../../images/indicators/ReceivedIndicatorLightDark1.png'),
    require('../../images/indicators/ReceivedIndicatorLightDark2.png')
  ]
};

const styles = StyleSheet.create({
  image: {
    width: 9,
    height: 10
  }
});

class ReceivedIndicator extends Component {
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

ReceivedIndicator.propTypes = {
  style: PropTypes.any,
  colorStyle: PropTypes.oneOf([COLOR_STYLE_COLOR, COLOR_STYLE_LIGHT]),
  status: PropTypes.oneOf([0, 1, 2]),
  theme: PropTypes.object.isRequired
};

ReceivedIndicator.defaultProps = {
  colorStyle: COLOR_STYLE_COLOR
};

export default withTheme(ReceivedIndicator);
