import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import SettingsTitle from '../../components/SettingsTitle';
import BaseSettingsScreen from './BaseSettingsScreen';

@connect((state) => ({
  bitcoinUnit: state.settings.bitcoin.unit,
  currency: state.settings.currency
}))
export default class GeneralSettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='General' />,
    headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />
  });

  _showAbout() {
    const navigation = this.props.navigation;
    navigation.navigate('About');
  }

  _showBitcoinUnit() {
    const { navigation } = this.props;
    navigation.navigate('BitcoinUnit');
  }

  _showSecondaryCurrency() {
    const { navigation } = this.props;

    navigation.navigate('SelectCurrency', {
      type: 'secondary'
    });
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsLink name='About' onPress={this._showAbout.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsTitle>Display Currency & Unit</SettingsTitle>
        <SettingsGroup>
          <SettingsLink name='Bitcoin Display Unit' value={this.props.bitcoinUnit} onPress={this._showBitcoinUnit.bind(this)} />
          <SettingsLink name='Secondary Currency' value={this.props.currency.secondary} onPress={this._showSecondaryCurrency.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

GeneralSettingsScreen.propTypes = {
  navigation: PropTypes.any,
  bitcoinUnit: PropTypes.string,
  currency: PropTypes.object,
};
