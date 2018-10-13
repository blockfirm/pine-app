import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsAttribute from '../../components/SettingsAttribute';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';
import config from '../../config';

@connect((state) => ({
  settings: state.settings
}))
export default class BitcoinSettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Bitcoin',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

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
          <SettingsAttribute name='Network' value={config.bitcoin.network} />
          <SettingsLink name='Display Unit' value={settings.bitcoin.unit} onPress={this._showBitcoinUnit.bind(this)} />
          <SettingsLink name='Transaction Fees' value={settings.bitcoin.fee.level} onPress={this._showBitcoinFeeSettings.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

BitcoinSettingsScreen.propTypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
