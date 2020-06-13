import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import headerStyles from '../styles/headerStyles';
import PendingBalanceIndicatorContainer from '../containers/indicators/PendingBalanceIndicatorContainer';
import ConnectionIndicatorContainer from '../containers/indicators/ConnectionIndicatorContainer';
import AddContactIcon from '../components/icons/AddContactIcon';
import SettingsIcon from '../components/icons/SettingsIcon';
import BalanceLabelContainer from '../containers/BalanceLabelContainer';
import { withTheme } from '../contexts/theme';
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
    left: 60,
    right: 60
  },
  titleAndDotWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleTouchable: {
    alignSelf: 'center'
  },
  title: {
    textAlign: 'center'
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500'
  },
  balanceWarning: {
    position: 'absolute',
    left: -12
  },
  connectionWarning: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  connectionWarningLightning: {
    position: 'absolute',
    right: 9,
    top: 9
  }
});

class ContactsScreenHeader extends Component {
  render() {
    const { theme } = this.props;

    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={this.props.onAddContactPress} style={styles.addContact}>
          <AddContactIcon />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <TouchableOpacity onPress={this.props.onBalancePress} style={styles.titleTouchable}>
            <View style={styles.titleAndDotWrapper}>
              <PendingBalanceIndicatorContainer style={styles.balanceWarning} />
              <BalanceLabelContainer
                currencyType='primary'
                style={[headerStyles.title, theme.headerTitle, styles.title]}
              />
            </View>
            <BalanceLabelContainer
              currencyType='secondary'
              style={[headerStyles.title, theme.headerSubtitle, styles.subTitle]}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={this.props.onSettingsPress} style={styles.settings}>
          <SettingsIcon />
          <ConnectionIndicatorContainer
            style={styles.connectionWarning}
            lightningBoltStyle={styles.connectionWarningLightning}
            withBorder={true}
            withLightningBolt={true}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

ContactsScreenHeader.propTypes = {
  onAddContactPress: PropTypes.func,
  onSettingsPress: PropTypes.func,
  onBalancePress: PropTypes.func,
  theme: PropTypes.object
};

export default withTheme(ContactsScreenHeader);
