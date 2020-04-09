/* eslint-disable max-lines */
import React, { Component } from 'react';
import { ActionSheetIOS, Alert, StyleSheet, View, Linking, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import iCloudAccountStatus from 'react-native-icloud-account-status';

import { withTheme } from '../../contexts/theme';
import { reset as navigateWithReset } from '../../actions/navigate';
import * as keyActions from '../../actions/keys';
import * as settingsActions from '../../actions/settings';
import { handle as handleError } from '../../actions/error';
import { avatar } from '../../clients/paymentServer/user';
import getMnemonicByKey from '../../crypto/getMnemonicByKey';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import BackButton from '../../components/BackButton';
import SettingsTitle from '../../components/SettingsTitle';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import SettingsButton from '../../components/SettingsButton';
import StyledText from '../../components/StyledText';
import EditAvatar from '../../components/EditAvatar';
import CopyText from '../../components/CopyText';
import BaseSettingsScreen from './BaseSettingsScreen';

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
    textAlign: 'center'
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
class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='Profile' />,
    headerLeft: <BackButton onPress={() => navigation.goBack()} />
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
    const { dispatch, screenProps } = this.props;
    const keepSettings = false;

    InteractionManager.runAfterInteractions(() => {
      screenProps.dismiss();
      dispatch(navigateWithReset('Reset', { keepSettings, keepBackup }));
    });
  }

  _getICloudBackupStatus() {
    const { dispatch, userProfile } = this.props;
    const pineAddress = userProfile.address;

    return iCloudAccountStatus.getStatus().then((accountStatus) => {
      if (accountStatus !== iCloudAccountStatus.STATUS_AVAILABLE) {
        return false;
      }

      return dispatch(keyActions.recover(pineAddress)).then((recoveredMnemonic) => {
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
    const { navigation } = this.props;
    navigation.navigate('DisplayName');
  }

  _showRecoveryKeyScreen() {
    const { navigation } = this.props;
    navigation.navigate('RecoveryKey');
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
    const { userProfile, theme } = this.props;
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
            <CopyText
              copyText={address}
              underlayColor={theme.settingsBackground.backgroundColor}
              tooltipArrowDirection='up'
            >
              <StyledText style={[styles.address, theme.settingsTitle]} numberOfLines={1}>
                {address}
              </StyledText>
            </CopyText>
          </View>
        </View>

        <SettingsTitle>Display Name</SettingsTitle>
        <SettingsGroup>
          <SettingsLink name={displayName} onPress={this._showDisplayNameScreen.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsTitle>Account Security</SettingsTitle>
        <SettingsGroup>
          <SettingsLink name='Recovery Key' onPress={this._showRecoveryKeyScreen.bind(this)} isLastItem={true} />
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
  navigation: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme(ProfileScreen);
