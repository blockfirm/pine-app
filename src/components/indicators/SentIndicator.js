import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const COLOR_STYLE_COLOR = 'color';
const COLOR_STYLE_LIGHT = 'light';

const IMAGES = {
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

const styles = StyleSheet.create({
  image: {
    width: 9,
    height: 10
  }
});

export default class SentIndicator extends Component {
  render() {
    const { status, style, colorStyle } = this.props;
    const image = IMAGES[colorStyle][status];

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
  status: PropTypes.oneOf([0, 1, 2])
};

SentIndicator.defaultProps = {
  colorStyle: COLOR_STYLE_COLOR
};
