import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../../contexts/theme';

const styles = StyleSheet.create({
  icon: {
    width: 12,
    height: 12
  }
});

class PlusIconAddOn extends Component {
  render() {
    const { theme, style } = this.props;

    return (
      <View style={style}>
        <Image source={theme.plusIconAddOn} style={styles.icon} />
      </View>
    );
  }
}

PlusIconAddOn.propTypes = {
  theme: PropTypes.object.isRequired,
  style: PropTypes.any
};

export default withTheme(PlusIconAddOn);
