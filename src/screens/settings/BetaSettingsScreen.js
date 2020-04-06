import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';

@connect()
export default class BetaSettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='Beta' />,
    headerLeft: <BackButton onPress={() => navigation.goBack()} />
  });

  _showAbout() {
    const { navigation } = this.props;
    navigation.navigate('AboutBeta');
  }

  _showLogs() {
    const { navigation } = this.props;
    navigation.navigate('Logs');
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsLink name='About' onPress={this._showAbout.bind(this)} />
          <SettingsLink name='Logs' onPress={this._showLogs.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

BetaSettingsScreen.propTypes = {
  navigation: PropTypes.any
};
