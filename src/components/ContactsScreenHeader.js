import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import headerStyles from '../styles/headerStyles';
import AddContactIcon from '../components/icons/AddContactIcon';
import SettingsIcon from '../components/icons/SettingsIcon';
import BalanceLabelContainer from '../containers/BalanceLabelContainer';
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
  addContact: {
    position: 'absolute',
    top: 0,
    left: 7.5,
    padding: 9 // The padding makes it easier to press.
  },
  settings: {
    position: 'absolute',
    top: 0,
    right: 7.5,
    padding: 9 // The padding makes it easier to press.
  },
  titleWrapper: {
    position: 'absolute',
    left: 40,
    right: 40
  },
  title: {
    textAlign: 'center'
  },
  subTitle: {
    textAlign: 'center',
    color: '#B1AFB7',
    fontSize: 13,
    fontWeight: '500'
  }
});

export default class ContactsScreenHeader extends Component {
  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={this.props.onAddContactPress} style={styles.addContact}>
          <AddContactIcon />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <BalanceLabelContainer currencyType='primary' style={[headerStyles.title, styles.title]} />
          <BalanceLabelContainer currencyType='secondary' style={[headerStyles.title, styles.subTitle]} />
        </View>

        <TouchableOpacity onPress={this.props.onSettingsPress} style={styles.settings}>
          <SettingsIcon />
        </TouchableOpacity>
      </View>
    );
  }
}

ContactsScreenHeader.propTypes = {
  onAddContactPress: PropTypes.func,
  onSettingsPress: PropTypes.func
};
