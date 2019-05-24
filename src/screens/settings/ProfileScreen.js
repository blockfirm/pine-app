import React, { Component } from 'react';
import { ActionSheetIOS, Alert, StyleSheet, View, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import iCloudAccountStatus from 'react-native-icloud-account-status';

import { reset as resetApp } from '../../actions';
import { reset as navigateWithReset } from '../../actions/navigate';
import * as keyActions from '../../actions/keys';
import * as settingsActions from '../../actions/settings';
import { handle as handleError } from '../../actions/error';
import { avatar } from '../../pineApi/user';
import getMnemonicByKey from '../../crypto/getMnemonicByKey';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsTitle from '../../components/SettingsTitle';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import SettingsButton from '../../components/SettingsButton';
import StyledText from '../../components/StyledText';
import EditAvatar from '../../components/EditAvatar';
import CopyText from '../../components/CopyText';
import BaseSettingsScreen from './BaseSettingsScreen';

const PINE_PAYMENT_SERVER_REPO_URL = 'https://github.com/blockfirm/pine-payment-server';

const styles = StyleSheet.create({
  profile: {
    paddingHorizontal: 15,
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
  signOutButtonContainer: {
    paddingRight: 0,
    marginLeft: 0
  },
  signOutButton: {
    alignSelf: 'center'
  },
  signOutButtonLoader: {
    right: null,
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
  static navigationOptions = ({ navigation }) => ({
    title: 'Profile',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  state = {
    signingOut: false
  };

  _getMnemonic() {
    const keys = Object.values(this.props.keys);
    const defaultKey = keys[0];

    return getMnemonicByKey(defaultKey.id);
  }

  _createManualBackup() {
    const navigation = this.props.navigation;

    return this._getMnemonic().then((mnemonic) => {
      navigation.navigate('BackUpMnemonic', {
        mnemonic,
        isModal: true
      });
    });
  }

  _showNoBackupAlert() {
    Alert.alert(
      'No Backups',
      'You cannot sign out from an account that has not been backed up. You would not have been able to sign back in again.',
      [
        { text: 'Create Manual Backup', onPress: this._createManualBackup.bind(this) },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: false }
    );
  }

  _removeWallet(keepBackup = true) {
    const dispatch = this.props.dispatch;
    const keepSettings = false;

    this.setState({ signingOut: true });

    return dispatch(resetApp(keepSettings, keepBackup))
      .then(() => {
        this.props.screenProps.dismiss();
        dispatch(navigateWithReset('Welcome'));
      })
      .catch((error) => {
        dispatch(handleError(error));
        this.setState({ signingOut: false });
      });
  }

  _getICloudBackupStatus() {
    const { dispatch } = this.props;

    return iCloudAccountStatus.getStatus().then((accountStatus) => {
      if (accountStatus !== iCloudAccountStatus.STATUS_AVAILABLE) {
        return false;
      }

      return dispatch(keyActions.recover()).then((recoveredMnemonic) => {
        if (!recoveredMnemonic) {
          return false;
        }

        return this._getMnemonic().then((mnemonic) => {
          return recoveredMnemonic === mnemonic;
        });
      });
    });
  }

  _showICloudOptions() {
    const { hasCreatedBackup } = this.props;

    ActionSheetIOS.showActionSheetWithOptions({
      title: 'Do you want to keep the iCloud backup?',
      options: ['Cancel', 'Erase iCloud Backup', 'Keep iCloud Backup'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      let keepBackup;

      switch (buttonIndex) {
        case 1: // Sign out and erase iCloud backup.
          if (!hasCreatedBackup) {
            return this._showNoBackupAlert();
          }

          keepBackup = false;
          return this._removeWallet(keepBackup);

        case 2: // Sign out but keep iCloud backup.
          keepBackup = true;
          return this._removeWallet(keepBackup);
      }
    });
  }

  _showResetAppConfirmation() {
    const { hasCreatedBackup } = this.props;

    return this._getICloudBackupStatus().then((hasICloudBackup) => {
      if (!hasICloudBackup && !hasCreatedBackup) {
        return this._showNoBackupAlert();
      }

      if (hasICloudBackup) {
        return this._showICloudOptions();
      }

      ActionSheetIOS.showActionSheetWithOptions({
        title: 'This will sign out your account from this device. You can only sign back in if you have a manual backup of your recovery key.',
        options: ['Cancel', 'Sign Out', 'Create Manual Backup'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0
      }, (buttonIndex) => {
        switch (buttonIndex) {
          case 1: // Sign Out.
            return this._removeWallet();

          case 2: // Create Manual Backup.
            return this._createManualBackup();
        }
      });
    });
  }

  _showDisplayNameScreen() {
    const navigation = this.props.navigation;
    navigation.navigate('DisplayName');
  }

  _visitPinePaymentServerRepo() {
    Linking.openURL(PINE_PAYMENT_SERVER_REPO_URL);
  }

  _saveAvatarChecksum(checksum) {
    const { dispatch } = this.props;

    const newSettings = {
      user: {
        profile: {
          avatar: { checksum }
        }
      }
    };

    dispatch(settingsActions.save(newSettings));
  }

  _goToAppSettings() {
    Linking.openURL('app-settings:');
  }

  _handleOnSelectError(error) {
    const { dispatch } = this.props;

    if (error.message.indexOf('permission') === -1) {
      return dispatch(handleError(error));
    }

    Alert.alert(
      'Allow Access to Photos',
      'Pine needs access to your photo library to set a new profile picture. Press Settings and then Photos and select Read and Write.',
      [
        { text: 'Not Now', style: 'cancel' },
        { text: 'Settings', onPress: this._goToAppSettings }
      ]
    );
  }

  _onSelectAvatar(image, error) {
    const { dispatch } = this.props;
    const { address } = this.props.userProfile;

    if (error) {
      return this._handleOnSelectError(error);
    }

    return this._getMnemonic().then((mnemonic) => {
      return avatar.set(image.data, { address, mnemonic })
        .then(({ checksum }) => {
          this._saveAvatarChecksum(checksum);
        })
        .catch((setError) => {
          dispatch(handleError(setError));
        });
    });
  }

  render() {
    const { userProfile } = this.props;
    const { address, displayName } = userProfile;
    const avatarChecksum = userProfile.avatar ? userProfile.avatar.checksum : null;

    return (
      <BaseSettingsScreen>
        <View style={styles.profile}>
          <EditAvatar
            onSelect={this._onSelectAvatar.bind(this)}
            pineAddress={address}
            checksum={avatarChecksum}
          />
          <View>
            <StyledText style={styles.displayName} numberOfLines={1}>{displayName}</StyledText>
            <CopyText copyText={address} underlayColor='#EFEFF3' tooltipArrowDirection='up'>
              <StyledText style={styles.address} numberOfLines={1}>{address}</StyledText>
            </CopyText>
          </View>
        </View>

        <SettingsTitle>Display Name</SettingsTitle>
        <SettingsGroup>
          <SettingsLink name={displayName} onPress={this._showDisplayNameScreen.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsButton
            title='Host Your Own Pine Server'
            onPress={this._visitPinePaymentServerRepo.bind(this)}
            isLastItem={true}
          />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsButton
            title='Sign Out'
            type='destructive'
            onPress={this._showResetAppConfirmation.bind(this)}
            loading={this.state.signingOut}
            style={styles.signOutButton}
            containerStyle={styles.signOutButtonContainer}
            loaderStyle={styles.signOutButtonLoader}
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
