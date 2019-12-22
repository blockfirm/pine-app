import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const styles = StyleSheet.create({
  icon: {
    width: 10,
    height: 17
  }
});

class BackIcon extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <Image source={this.props.theme.backIcon} style={styles.icon} />
      </View>
    );
  }
}

BackIcon.propTypes = {
  style: PropTypes.any,
  theme: PropTypes.object
};

export default withTheme(BackIcon);
