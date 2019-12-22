import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const styles = StyleSheet.create({
  bullet: {
    marginHorizontal: 10,
    height: 3,
    width: 3,
    borderRadius: 2
  }
});

class Bullet extends Component {
  render() {
    const { style, theme } = this.props;

    return (
      <View style={[styles.bullet, theme.bulletPoint, style]} />
    );
  }
}

Bullet.propTypes = {
  style: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme(Bullet);
