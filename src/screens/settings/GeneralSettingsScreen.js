import React, { Component } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateWithReset, reset as resetApp } from '../../actions';
import * as settingsActions from '../../actions/settings';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsButton from '../../components/SettingsButton';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';

@connect()
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

  _showRemoveWalletConfirmation() {
    const dispatch = this.props.dispatch;

    Alert.alert(
      'Erase Wallet?',
      'This will erase the wallet from your device and iCloud account. You can only recover it if you have made a manual backup of your recovery key.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Erase Wallet',
          style: 'destructive',
          onPress: () => {
            const keepSettings = true;

            dispatch(resetApp(keepSettings)).then(() => {
              this._flagAsUninitialized();
              this.props.screenProps.dismiss();
              dispatch(navigateWithReset('Welcome'));
            });
          }
        }
      ],
      { cancelable: false }
    );
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
    Alert.alert(
      'Erase Wallet and Settings?',
      'This will erase the wallet from your device and iCloud account. You can only recover it if you have made a manual backup of your recovery key.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Erase Wallet and Settings',
          style: 'destructive',
          onPress: this._resetAppAndShowWelcomeScreen.bind(this)
        }
      ],
      { cancelable: false }
    );
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
            type='destructive'
            onPress={this._showRemoveWalletConfirmation.bind(this)}
          />
          <SettingsButton
            title='Erase Wallet and Settings'
            type='destructive'
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
  navigation: PropTypes.any
};
