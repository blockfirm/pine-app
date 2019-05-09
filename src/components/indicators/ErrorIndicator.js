import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const COLOR_STYLE_COLOR = 'color';
const COLOR_STYLE_LIGHT = 'light';

const IMAGES = {
  [COLOR_STYLE_COLOR]: require('../../images/indicators/ErrorIndicator.png'),
  [COLOR_STYLE_LIGHT]: require('../../images/indicators/ErrorIndicatorLight.png')
};

const styles = StyleSheet.create({
  image: {
    width: 10,
    height: 10
  }
});

export default class ErrorIndicator extends Component {
  render() {
    const { style, colorStyle } = this.props;
    const image = IMAGES[colorStyle];

    return (
      <View style={style}>
        <Image source={image} style={styles.image} />
      </View>
    );
  }
}

ErrorIndicator.propTypes = {
  style: PropTypes.any,
  colorStyle: PropTypes.oneOf([COLOR_STYLE_COLOR, COLOR_STYLE_LIGHT])
};

ErrorIndicator.defaultProps = {
  colorStyle: COLOR_STYLE_COLOR
};
