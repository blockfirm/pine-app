import React, { Component } from 'react';
import { ActionSheetIOS, Alert, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateWithReset, reset as resetApp } from '../../actions';
import * as settingsActions from '../../actions/settings';
import getMnemonicByKey from '../../crypto/getMnemonicByKey';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsTitle from '../../components/SettingsTitle';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import SettingsButton from '../../components/SettingsButton';
import Avatar from '../../components/Avatar';
import StyledText from '../../components/StyledText';
import BaseSettingsScreen from './BaseSettingsScreen';

const styles = StyleSheet.create({
  profile: {
    marginBottom: 35,
    alignItems: 'center'
  },
  displayName: {
    fontSize: 26,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 3
  },
  address: {
    fontSize: 14,
    textAlign: 'center',
    color: '#8A8A8F'
  },
  signOutButton: {
    alignSelf: 'center'
  }
});

@connect((state) => ({
  keys: state.keys.items,
  userProfile: state.settings.user.profile,
  hasCreatedBackup: state.settings.user.hasCreatedBackup,
  balance: state.bitcoin.wallet.balance
}))
export default class ProfileScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'Profile',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  _flagAsUninitialized() {
    const dispatch = this.props.dispatch;

    const newSettings = {
      initialized: false,
      user: {
        hasCreatedBackup: false
      }
    };

    return dispatch(settingsActions.save(newSettings));
  }

  _createManualBackup() {
    const navigation = this.props.navigation;
    const keys = Object.values(this.props.keys);
    const defaultKey = keys[0];

    return getMnemonicByKey(defaultKey.id).then((mnemonic) => {
      navigation.navigate('BackUpMnemonic', {
        mnemonic,
        isModal: true
      });
    });
  }

  _canErase() {
    // Cannot remove a wallet with funds in it that hasn't been backed up.
    const { hasCreatedBackup, balance } = this.props;
    return balance === 0 || hasCreatedBackup;
  }

  _showWalletNotEmptyAlert() {
    Alert.alert(
      'Account Not Empty',
      'You cannot sign out from a non-empty account that has not been manually backed up. You would not have been able to sign back in again.',
      [
        { text: 'Create Manual Backup', onPress: this._createManualBackup.bind(this) },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: false }
    );
  }

  _removeWallet(keepSettings) {
    const dispatch = this.props.dispatch;

    return dispatch(resetApp(keepSettings)).then(() => {
      if (keepSettings) {
        this._flagAsUninitialized();
      }

      this.props.screenProps.dismiss();
      dispatch(navigateWithReset('Welcome'));
    });
  }

  _showResetAppConfirmation() {
    if (!this._canErase()) {
      return this._showWalletNotEmptyAlert();
    }

    ActionSheetIOS.showActionSheetWithOptions({
      title: 'This will sign out your account from this device and iCloud. You can only sign back in if you have a manual backup of the recovery key.',
      options: ['Cancel', 'Sign Out', 'Create Manual Backup'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 1: // Erase Wallet and Settings.
          return this._removeWallet(false);

        case 2: // Create Manual Backup.
          return this._createManualBackup();
      }
    });
  }

  render() {
    const { userProfile } = this.props;
    const { pineAddress, displayName } = userProfile;

    return (
      <BaseSettingsScreen>
        <View style={styles.profile}>
          <Avatar size={80} />
          <View>
            <StyledText style={styles.displayName} numberOfLines={1}>{displayName}</StyledText>
            <StyledText style={styles.address} numberOfLines={1}>{pineAddress}</StyledText>
          </View>
        </View>

        <SettingsTitle>Display Name</SettingsTitle>
        <SettingsGroup>
          <SettingsLink name={displayName} onPress={() => {}} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsButton
            title='Sign Out'
            type='destructive'
            onPress={this._showResetAppConfirmation.bind(this)}
            style={styles.signOutButton}
            isLastItem={true}
          />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

ProfileScreen.propTypes = {
  keys: PropTypes.object,
  userProfile: PropTypes.object,
  hasCreatedBackup: PropTypes.bool,
  balance: PropTypes.number,
  screenProps: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
