import React, { Component } from 'react';
import { ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateWithReset, reset as resetApp } from '../../actions';
import * as settingsActions from '../../actions/settings';
import getMnemonicByKey from '../../crypto/getMnemonicByKey';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsButton from '../../components/SettingsButton';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';

@connect((state) => ({
  keys: state.keys.items
}))
export default class GeneralSettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'General',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  _showAbout() {
    const navigation = this.props.navigation;
    navigation.navigate('About');
  }

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
      navigation.navigate('MnemonicModal', {
        mnemonic,
        isModal: true
      });
    });
  }

  _showRemoveWalletConfirmation() {
    const dispatch = this.props.dispatch;
    const keepSettings = true;

    ActionSheetIOS.showActionSheetWithOptions({
      title: 'This will erase the wallet from your device and iCloud account. You can only recover it if you have made a manual backup of your recovery key.',
      options: ['Cancel', 'Erase Wallet', 'Create Manual Backup'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 1: // Erase Wallet.
          return dispatch(resetApp(keepSettings)).then(() => {
            this._flagAsUninitialized();
            this.props.screenProps.dismiss();
            dispatch(navigateWithReset('Welcome'));
          });

        case 2: // Create Manual Backup.
          return this._createManualBackup();
      }
    });
  }

  _resetAppAndShowWelcomeScreen() {
    const dispatch = this.props.dispatch;

    return dispatch(resetApp())
      .then(() => {
        this.props.screenProps.dismiss();
      })
      .then(() => {
        dispatch(navigateWithReset('Welcome'));
      });
  }

  _showResetAppConfirmation() {
    ActionSheetIOS.showActionSheetWithOptions({
      title: 'This will erase the wallet from your device and iCloud account. You can only recover it if you have made a manual backup of your recovery key.',
      options: ['Cancel', 'Erase Wallet and Settings', 'Create Manual Backup'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 1: // Erase Wallet and Settings.
          return this._resetAppAndShowWelcomeScreen();

        case 2: // Create Manual Backup.
          return this._createManualBackup();
      }
    });
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsLink name='About' onPress={this._showAbout.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsButton
            title='Erase Wallet'
            onPress={this._showRemoveWalletConfirmation.bind(this)}
          />
          <SettingsButton
            title='Erase Wallet and Settings'
            onPress={this._showResetAppConfirmation.bind(this)}
            isLastItem={true}
          />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

GeneralSettingsScreen.propTypes = {
  screenProps: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  keys: PropTypes.object
};
