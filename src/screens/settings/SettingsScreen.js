import React, { Component } from 'react';
import { Text, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateWithReset } from '../../actions';
import * as settingsActions from '../../actions/settings';
import * as keyActions from '../../actions/keys';
import removeMnemonicByKey from '../../crypto/removeMnemonicByKey';
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

  _showBitcoinUnit() {
    const navigation = this.props.navigation;
    navigation.navigate('BitcoinUnit');
  }

  _showMnemonic() {
    const navigation = this.props.navigation;
    navigation.navigate('ShowMnemonic');
  }

  _resetApp() {
    const dispatch = this.props.dispatch;
    const keys = Object.values(this.props.keys);

    // Delete each key and mnemonic.
    const promises = keys.map((key) => {
      return removeMnemonicByKey(key.id).then(() => {
        return dispatch(keyActions.remove(key));
      });
    });

    // Once removed, reset settings and navigate to Welcome.
    return Promise.all(promises)
      .then(() => {
        dispatch(settingsActions.reset());
        this.props.screenProps.dismiss();
      })
      .then(() => {
        dispatch(navigateWithReset('Welcome'));
      });
  }

  _showResetAppConfirmation() {
    Alert.alert(
      'Reset?',
      'This will permanently delete your key and reset all settings. You can only recover the key if you have your recovery key. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: this._resetApp.bind(this)
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
          <SettingsLink name='Bitcoin Display Unit' value={settings.bitcoin.unit} onPress={this._showBitcoinUnit.bind(this)} />
          <SettingsLink name='Show Recovery Key' onPress={this._showMnemonic.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsButton
            title='Reset'
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
