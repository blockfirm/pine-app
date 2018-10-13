import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import headerStyles from '../../styles/headerStyles';
import DoneButton from '../../components/DoneButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';

@connect((state) => ({
  settings: state.settings
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

  _showGeneralSettings() {
    const navigation = this.props.navigation;
    navigation.navigate('GeneralSettings');
  }

  _showSecurityAndPrivacySettings() {
    const navigation = this.props.navigation;
    navigation.navigate('SecurityAndPrivacySettings');
  }

  _showBitcoinUnit() {
    const navigation = this.props.navigation;
    navigation.navigate('BitcoinUnit');
  }

  _showBitcoinFeeSettings() {
    const navigation = this.props.navigation;
    navigation.navigate('BitcoinFeeSettings');
  }

  render() {
    const settings = this.props.settings;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsLink name='General' onPress={this._showGeneralSettings.bind(this)} />
          <SettingsLink name='Security and Privacy' onPress={this._showSecurityAndPrivacySettings.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsLink name='Bitcoin Display Unit' value={settings.bitcoin.unit} onPress={this._showBitcoinUnit.bind(this)} />
          <SettingsLink name='Bitcoin Transaction Fees' value={settings.bitcoin.fee.level} onPress={this._showBitcoinFeeSettings.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

SettingsScreen.propTypes = {
  settings: PropTypes.object,
  screenProps: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
