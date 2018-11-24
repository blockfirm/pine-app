import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import headerStyles from '../styles/headerStyles';
import ForwardWhiteButton from '../components/ForwardWhiteButton';
import StyledText from '../components/StyledText';
import getStatusBarHeight from '../utils/getStatusBarHeight';
import getNavBarHeight from '../utils/getNavBarHeight';

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginTop: getStatusBarHeight(),
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: getNavBarHeight()
  },
  backButton: {
    padding: 5
  },
  title: {
    position: 'absolute',
    left: 40,
    right: 40,
    textAlign: 'center',
    color: 'white'
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -0.1, height: 0.1 },
    textShadowRadius: 1
  }
});

export default class CameraScreenHeader extends Component {
  render() {
    return (
      <View style={styles.header}>
        <StyledText style={[headerStyles.title, styles.title, styles.textShadow]}>
          Send Bitcoin
        </StyledText>

        <ForwardWhiteButton
          onPress={this.props.onBackPress}
          style={styles.backButton}
        />
      </View>
    );
  }
}

CameraScreenHeader.propTypes = {
  onBackPress: PropTypes.func
};
