import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
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
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='Bitcoin' />,
    headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />
  });

  _showBitcoinUnit() {
    const navigation = this.props.navigation;
    navigation.navigate('BitcoinUnit');
  }

  render() {
    const settings = this.props.settings;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsAttribute name='Network' value={config.bitcoin.network} />
          <SettingsLink name='Display Unit' value={settings.bitcoin.unit} onPress={this._showBitcoinUnit.bind(this)} isLastItem={true} />
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
