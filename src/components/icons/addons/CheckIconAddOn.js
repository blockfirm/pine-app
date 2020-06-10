import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../../contexts/theme';

const styles = StyleSheet.create({
  icon: {
    width: 11,
    height: 11
  }
});

class CheckIconAddOn extends Component {
  render() {
    const { theme, style } = this.props;

    return (
      <View style={style}>
        <Image source={theme.checkIconAddOn} style={styles.icon} />
      </View>
    );
  }
}

CheckIconAddOn.propTypes = {
  theme: PropTypes.object.isRequired,
  style: PropTypes.any
};

export default withTheme(CheckIconAddOn);
