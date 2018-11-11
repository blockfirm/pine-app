import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import headerStyles from '../styles/headerStyles';
import SettingsIcon from '../components/icons/SettingsIcon';
import BtcBalanceLabelContainer from '../containers/BtcBalanceLabelContainer';
import getStatusBarHeight from '../utils/getStatusBarHeight';
import getNavBarHeight from '../utils/getNavBarHeight';

const styles = StyleSheet.create({
  header: {
    marginTop: getStatusBarHeight(),
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: getNavBarHeight()
  },
  settings: {
    position: 'absolute',
    top: 0,
    right: 7.5,
    padding: 9 // The padding makes it easier to press.
  },
  title: {
    position: 'absolute',
    left: 40,
    right: 40,
    textAlign: 'center'
  }
});

export default class TransactionsScreenHeader extends Component {
  render() {
    return (
      <View style={styles.header}>
        <BtcBalanceLabelContainer style={[headerStyles.title, styles.title]} />

        <TouchableOpacity onPress={this.props.onSettingsPress} style={styles.settings}>
          <SettingsIcon />
        </TouchableOpacity>
      </View>
    );
  }
}

TransactionsScreenHeader.propTypes = {
  onSettingsPress: PropTypes.func
};
