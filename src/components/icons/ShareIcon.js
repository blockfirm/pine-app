import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../../contexts/theme';

const styles = StyleSheet.create({
  icon: {
    width: 18,
    height: 27
  }
});

class ShareIcon extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <Image source={this.props.theme.shareIcon} style={styles.icon} />
      </View>
    );
  }
}

ShareIcon.propTypes = {
  style: PropTypes.any,
  theme: PropTypes.object
};

export default withTheme(ShareIcon);
