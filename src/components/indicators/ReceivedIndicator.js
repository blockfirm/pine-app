import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const COLOR_STYLE_COLOR = 'color';
const COLOR_STYLE_LIGHT = 'light';

const IMAGES = {
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

const styles = StyleSheet.create({
  image: {
    width: 9,
    height: 10
  }
});

export default class ReceivedIndicator extends Component {
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

ReceivedIndicator.propTypes = {
  style: PropTypes.any,
  colorStyle: PropTypes.oneOf([COLOR_STYLE_COLOR, COLOR_STYLE_LIGHT]),
  status: PropTypes.oneOf([0, 1, 2])
};

ReceivedIndicator.defaultProps = {
  colorStyle: COLOR_STYLE_COLOR
};
