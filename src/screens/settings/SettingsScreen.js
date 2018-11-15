import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import headerStyles from '../../styles/headerStyles';
import DoneButton from '../../components/DoneButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';

@connect()
export default class SettingsScreen extends Component {
  static navigationOptions = ({ screenProps }) => ({
    title: 'Settings',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerBackTitle: null,
    headerRight: (<DoneButton onPress={screenProps.dismiss} />)
  });

  _showGeneralSettings() {
    const navigation = this.props.navigation;
    navigation.navigate('GeneralSettings');
  }

  _showSecurityAndPrivacySettings() {
    const navigation = this.props.navigation;
    navigation.navigate('SecurityAndPrivacySettings');
  }

  _showBitcoinSettings() {
    const navigation = this.props.navigation;
    navigation.navigate('BitcoinSettings');
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsLink icon={SettingsLink.ICON_GEAR} name='General' onPress={this._showGeneralSettings.bind(this)} />
          <SettingsLink icon={SettingsLink.ICON_LOCK} name='Security and Privacy' onPress={this._showSecurityAndPrivacySettings.bind(this)} />
          <SettingsLink icon={SettingsLink.ICON_BITCOIN} name='Bitcoin' onPress={this._showBitcoinSettings.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

SettingsScreen.propTypes = {
  screenProps: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
