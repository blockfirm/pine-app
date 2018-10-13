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

  _showServiceUrl() {
    const navigation = this.props.navigation;
    navigation.navigate('ServiceUrl');
  }

  _showMnemonic() {
    const navigation = this.props.navigation;
    navigation.navigate('ShowMnemonic');
  }

  render() {
    const settings = this.props.settings;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsLink name='Service URL' value={settings.api.baseUrl} onPress={this._showServiceUrl.bind(this)} />
          <SettingsLink name='Recovery Key' onPress={this._showMnemonic.bind(this)} isLastItem={true} />
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
