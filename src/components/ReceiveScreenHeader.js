import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import StyledText from '../components/StyledText';
import BackButton from '../components/BackButton';
import ShareIcon from '../components/icons/ShareIcon';
import headerStyles from '../styles/headerStyles';
import getStatusBarHeight from '../utils/getStatusBarHeight';
import getNavBarHeight from '../utils/getNavBarHeight';

const styles = StyleSheet.create({
  header: {
    marginTop: getStatusBarHeight(),
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: getNavBarHeight(),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  backButton: {
    padding: 5,
    paddingTop: 7
  },
  title: {
    position: 'absolute',
    left: 40,
    right: 40,
    textAlign: 'center'
  },
  share: {
    position: 'absolute',
    top: 4,
    right: 15.5,
    padding: 5 // The padding makes it easier to press.
  }
});

export default class ReceiveScreenHeader extends Component {
  render() {
    return (
      <View style={styles.header}>
        <BackButton onPress={this.props.onBackPress} style={styles.backButton} />

        <StyledText style={[headerStyles.title, styles.title, styles.textShadow]}>
          Receive Bitcoin
        </StyledText>

        <TouchableOpacity onPress={this.props.onSharePress} style={styles.share}>
          <ShareIcon />
        </TouchableOpacity>
      </View>
    );
  }
}

ReceiveScreenHeader.propTypes = {
  onBackPress: PropTypes.func,
  onSharePress: PropTypes.func
};
