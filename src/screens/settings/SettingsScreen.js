import React, { Component } from 'react';
import { Text, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateWithReset, reset as resetApp } from '../../actions';
import * as settingsActions from '../../actions/settings';
import headerStyles from '../../styles/headerStyles';
import DoneButton from '../../components/DoneButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsButton from '../../components/SettingsButton';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';

@connect((state) => ({
  settings: state.settings,
  keys: state.keys.items
}))
export default class SettingsScreen extends Component {
  static navigationOptions = ({ screenProps }) => ({
    title: 'Settings',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerBackTitle: null,
    headerRight: (<DoneButton onPress={screenProps.dismiss} />),

    // HACK: Hack to disable the back navigation on the initial settings screen.
    headerLeft: (<Text />),
    gestureResponseDistance: { horizontal: -1, vertical: 135 }
  });

  _showAbout() {
    const navigation = this.props.navigation;
    navigation.navigate('About');
  }

  _showServiceUrl() {
    const navigation = this.props.navigation;
    navigation.navigate('ServiceUrl');
  }

  _showBitcoinUnit() {
    const navigation = this.props.navigation;
    navigation.navigate('BitcoinUnit');
  }

  _showBitcoinFeeSettings() {
    const navigation = this.props.navigation;
    navigation.navigate('BitcoinFeeSettings');
  }

  _showMnemonic() {
    const navigation = this.props.navigation;
    navigation.navigate('ShowMnemonic');
  }

  _flagAsUninitialized() {
    const dispatch = this.props.dispatch;

    const newSettings = {
      initialized: false
    };

    return dispatch(settingsActions.save(newSettings));
  }

  _recoverWallet() {
    const dispatch = this.props.dispatch;

    Alert.alert(
      'Recover Another Wallet?',
      'This will remove the current wallet. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Recover',
          style: 'destructive',
          onPress: () => {
            const keepSettings = true;

            dispatch(resetApp(keepSettings)).then(() => {
              this._flagAsUninitialized();
              this.props.screenProps.dismiss();
              dispatch(navigateWithReset('ImportMnemonic'));
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
      'Reset?',
      'This will remove the wallet and reset all settings. You can only recover the wallet if you have your recovery key. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: this._resetAppAndShowWelcomeScreen.bind(this)
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    const settings = this.props.settings;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsLink name='About' onPress={this._showAbout.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsLink name='Service URL' value={settings.api.baseUrl} onPress={this._showServiceUrl.bind(this)} />
          <SettingsLink name='Bitcoin Display Unit' value={settings.bitcoin.unit} onPress={this._showBitcoinUnit.bind(this)} />
          <SettingsLink name='Bitcoin Transaction Fees' value={settings.bitcoin.fee.level} onPress={this._showBitcoinFeeSettings.bind(this)} />
          <SettingsLink name='Show Recovery Key' onPress={this._showMnemonic.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsButton
            title='Recover Another Wallet'
            type='destructive'
            onPress={this._recoverWallet.bind(this)}
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

SettingsScreen.propTypes = {
  settings: PropTypes.object,
  keys: PropTypes.object,
  screenProps: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
