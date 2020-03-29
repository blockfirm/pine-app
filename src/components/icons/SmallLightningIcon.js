import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const styles = StyleSheet.create({
  icon: {
    width: 8,
    height: 10
  }
});

class SmallLightningIcon extends Component {
  render() {
    const { theme, style } = this.props;

    return (
      <View style={style}>
        <Image source={theme.smallLightningIconImage} style={styles.icon} />
      </View>
    );
  }
}

SmallLightningIcon.propTypes = {
  theme: PropTypes.object.isRequired,
  style: PropTypes.any
};

export default withTheme(SmallLightningIcon);
