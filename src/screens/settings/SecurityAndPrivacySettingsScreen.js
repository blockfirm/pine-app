import React, { Component } from 'react';
import PropTypes from 'prop-types';

import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';

export default class SecurityAndPrivacySettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Security and Privacy',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  _showBitcoinServiceScreen() {
    const navigation = this.props.navigation;
    navigation.navigate('BitcoinService');
  }

  _showRecoveryKeyScreen() {
    const navigation = this.props.navigation;
    navigation.navigate('RecoveryKey');
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsLink name='Bitcoin Service' onPress={this._showBitcoinServiceScreen.bind(this)} />
          <SettingsLink name='Recovery Key' onPress={this._showRecoveryKeyScreen.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

SecurityAndPrivacySettingsScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
