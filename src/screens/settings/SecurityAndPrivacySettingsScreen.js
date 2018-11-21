import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';

@connect((state) => ({
  settings: state.settings
}))
export default class SecurityAndPrivacySettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Security and Privacy',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  _showServiceUrlScreen() {
    const navigation = this.props.navigation;
    navigation.navigate('ServiceUrl');
  }

  _showRecoveryKeyScreen() {
    const navigation = this.props.navigation;
    navigation.navigate('RecoveryKey');
  }

  render() {
    const settings = this.props.settings;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsLink name='Service URL' value={settings.api.baseUrl} onPress={this._showServiceUrlScreen.bind(this)} />
          <SettingsLink name='Recovery Key' onPress={this._showRecoveryKeyScreen.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

SecurityAndPrivacySettingsScreen.propTypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
