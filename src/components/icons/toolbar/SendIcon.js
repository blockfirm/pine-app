import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../../contexts/theme';

const IMAGE_WHITE = require('../../../images/icons/toolbar/SendWhite.png');

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50
  }
});

class SendIcon extends Component {
  render() {
    const { white, theme } = this.props;
    const image = white ? IMAGE_WHITE : theme.toolbarSendIcon;

    return (
      <View style={this.props.style}>
        <Image source={image} style={styles.icon} />
      </View>
    );
  }
}

SendIcon.propTypes = {
  style: PropTypes.any,
  white: PropTypes.bool,
  theme: PropTypes.object
};

export default withTheme(SendIcon);
