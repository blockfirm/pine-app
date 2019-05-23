import React, { Component } from 'react';
import { Alert, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactNativeHaptic from 'react-native-haptic';
import iCloudAccountStatus from 'react-native-icloud-account-status';

import * as keyActions from '../../actions/keys';
import getMnemonicByKey from '../../crypto/getMnemonicByKey';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsAttribute from '../../components/SettingsAttribute';
import SettingsButton from '../../components/SettingsButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsDescription from '../../components/SettingsDescription';
import BaseSettingsScreen from './BaseSettingsScreen';

const OPEN_SETTINGS_URL_STRING = 'App-Prefs:';

@connect((state) => ({
  keys: state.keys.items,
  hasCreatedBackup: state.settings.user.hasCreatedBackup,
  pineAddress: state.settings.user.profile.address
}))
export default class RecoveryKeyScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Recovery Key',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  state = {
    phrase: '',
    storeInICloud: false
  }

  componentDidMount() {
    const dispatch = this.props.dispatch;
    const keys = Object.values(this.props.keys);
    const defaultKey = keys[0];

    getMnemonicByKey(defaultKey.id).then((mnemonic) => {
      this.setState({ phrase: mnemonic });
      this._checkICloudBackupStatus();
    });
  }

  _checkICloudBackupStatus() {
    const dispatch = this.props.dispatch;
    const mnemonic = this.state.phrase;

    return iCloudAccountStatus.getStatus().then((accountStatus) => {
      if (accountStatus !== iCloudAccountStatus.STATUS_AVAILABLE) {
        return;
      }

      return dispatch(keyActions.recover()).then((recoveredMnemonic) => {
        if (recoveredMnemonic !== mnemonic) {
          return;
        }

        this.setState({ storeInICloud: true });
      });
    });
  }

  _updateICloudState(storeInICloud) {
    const { dispatch, pineAddress } = this.props;
    const mnemonic = this.state.phrase;

    this.setState({ storeInICloud });

    if (storeInICloud) {
      return dispatch(keyActions.backup(mnemonic, pineAddress));
    }

    return dispatch(keyActions.removeBackup(pineAddress));
  }

  _onStoreInICloudChange(storeInICloud) {
    const activate = !this.state.storeInICloud && storeInICloud;

    if (!activate && !this.props.hasCreatedBackup) {
      return this._showMissingManualBackupAlert();
    }

    if (activate) {
      return iCloudAccountStatus.getStatus().then((accountStatus) => {
        if (accountStatus === iCloudAccountStatus.STATUS_AVAILABLE) {
          return this._updateICloudState(storeInICloud);
        }

        this._showICloudUnavailableAlert();
      });
    }

    return this._updateICloudState(storeInICloud);
  }

  _showMissingManualBackupAlert() {
    ReactNativeHaptic.generate('notificationWarning');

    Alert.alert(
      'Missing Manual Backup',
      'The recovery key can only be removed from iCloud if it has been manually backed up.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Back up Manually',
          onPress: this._backUpManually.bind(this)
        }
      ],
      { cancelable: false }
    );
  }

  _showICloudUnavailableAlert() {
    ReactNativeHaptic.generate('notificationWarning');

    Alert.alert(
      'iCloud Not Available',
      'Make sure that you are logged in to iCloud and has given Pine access.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Settings',
          onPress: () => { Linking.openURL(OPEN_SETTINGS_URL_STRING); }
        }
      ],
      { cancelable: false }
    );
  }

  _backUpManually() {
    const navigation = this.props.navigation;

    navigation.navigate('BackUpMnemonic', {
      mnemonic: this.state.phrase,
      isModal: true
    });
  }

  render() {
    const hasCreatedBackup = this.props.hasCreatedBackup;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsAttribute
            name='Back up in iCloud'
            value={this.state.storeInICloud}
            onValueChange={this._onStoreInICloudChange.bind(this)}
            isLastItem={true}
          />
        </SettingsGroup>
        <SettingsDescription>
          Saving your recovery key in iCloud is safe and convenient as long as you keep your iCloud account secure.
        </SettingsDescription>

        <SettingsGroup>
          <SettingsButton
            title='Back up Manually'
            showCheckmark={Boolean(hasCreatedBackup)}
            onPress={this._backUpManually.bind(this)}
            isLastItem={true}
          />
        </SettingsGroup>
        <SettingsDescription>
          Backing up your recovery key manually on a piece of paper is a good alternative in case you would
          lose access to your iCloud account, or if you don&#39;t want to store your key in iCloud.
        </SettingsDescription>
      </BaseSettingsScreen>
    );
  }
}

RecoveryKeyScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  keys: PropTypes.object,
  hasCreatedBackup: PropTypes.bool,
  pineAddress: PropTypes.string
};
