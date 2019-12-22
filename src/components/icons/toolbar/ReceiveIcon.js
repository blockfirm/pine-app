import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../../contexts/theme';

const IMAGE_WHITE = require('../../../images/icons/toolbar/ReceiveWhite.png');

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50
  }
});

class ReceiveIcon extends Component {
  render() {
    const { white, theme } = this.props;
    const image = white ? IMAGE_WHITE : theme.toolbarReceiveIcon;

    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

ReceiveIcon.propTypes = {
  style: PropTypes.any,
  white: PropTypes.bool,
  theme: PropTypes.object
};

export default withTheme(ReceiveIcon);
