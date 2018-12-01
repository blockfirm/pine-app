import React, { Component } from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsDescription from '../../components/SettingsDescription';
import SettingsButton from '../../components/SettingsButton';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';

const PINE_API_REPO_URL = 'https://github.com/blockfirm/pine-api';

@connect((state) => ({
  settings: state.settings
}))
export default class BitcoinServiceScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Bitcoin Service',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  _visitPineAPIRepo() {
    Linking.openURL(PINE_API_REPO_URL);
  }

  _showServiceUrlScreen() {
    const navigation = this.props.navigation;
    navigation.navigate('ServiceUrl');
  }

  render() {
    const settings = this.props.settings;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsLink name='Service URL' value={settings.api.baseUrl} onPress={this._showServiceUrlScreen.bind(this)} />
        </SettingsGroup>

        <SettingsDescription>
          The Service URL is used to communicate with an API to retrieve and submit information
          to the bitcoin blockchain. By default this service is provided by Pine, but you can
          host your own service and enter its URL here to gain extra privacy and control.
        </SettingsDescription>

        <SettingsGroup>
          <SettingsButton title='Host Your Own Service' onPress={this._visitPineAPIRepo.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

BitcoinServiceScreen.propTypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
