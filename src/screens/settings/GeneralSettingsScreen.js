import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import SettingsTitle from '../../components/SettingsTitle';
import BaseSettingsScreen from './BaseSettingsScreen';

@connect((state) => ({
  currency: state.settings.currency
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

  _showSecondaryCurrency() {
    const navigation = this.props.navigation;

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

        <SettingsTitle>Display Currency</SettingsTitle>
        <SettingsGroup>
          <SettingsLink name='Secondary Currency' value={this.props.currency.secondary} onPress={this._showSecondaryCurrency.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

GeneralSettingsScreen.propTypes = {
  navigation: PropTypes.any,
  currency: PropTypes.object,
};
