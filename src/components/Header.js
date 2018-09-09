import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import headerStyles from '../styles/headerStyles';
import BackButton from './BackButton';

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 42,
    zIndex: 1000
  },
  backButton: {
    position: 'absolute',
    top: ifIphoneX(60, 36),
    left: 10
  },
  title: {
    position: 'absolute',
    top: ifIphoneX(60, 36),
    left: 40,
    right: 40,
    textAlign: 'center'
  }
});

export default class Header extends Component {
  render() {
    const { showBackButton } = this.props;

    return (
      <View style={styles.header}>
        { showBackButton ? <BackButton onPress={this.props.onBackPress} style={styles.backButton} iconStyle={this.props.backButtonIconStyle} /> : null }

        <Text style={[headerStyles.title, styles.title]}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}

Header.propTypes = {
  showBackButton: PropTypes.bool,
  onBackPress: PropTypes.func,
  backButtonIconStyle: PropTypes.any,
  title: PropTypes.string
};
