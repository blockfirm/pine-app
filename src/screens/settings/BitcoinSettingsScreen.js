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

@connect((state) => ({
  settings: state.settings
}))
export default class BitcoinSettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='Bitcoin' />,
    headerLeft: <BackButton onPress={() => navigation.goBack()} />
  });

  _showBitcoinServiceScreen() {
    const { navigation } = this.props;
    navigation.navigate('BitcoinService');
  }

  _showOnChainBalance() {
    const { navigation } = this.props;
    navigation.navigate('OnChainBalance');
  }

  render() {
    const { settings } = this.props;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsAttribute name='Network' value={settings.bitcoin.network} />
          <SettingsLink name='Bitcoin Service' onPress={this._showBitcoinServiceScreen.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsLink name='Balance' onPress={this._showOnChainBalance.bind(this)} isLastItem={true} />
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
