import React, { Component } from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { save as saveSettings } from '../../actions/settings';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsInput from '../../components/SettingsInput';
import SettingsDescription from '../../components/SettingsDescription';
import SettingsButton from '../../components/SettingsButton';
import BaseSettingsScreen from './BaseSettingsScreen';
import config from '../../config';

const PAYLA_API_REPO_URL = 'https://github.com/blockfirm/payla-api';

@connect((state) => ({
  settings: state.settings
}))
export default class ServiceUrlScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Service URL',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  constructor(props) {
    super(...arguments);

    this.state = {
      serviceUrl: props.settings.api.baseUrl
    };
  }

  componentWillUnmount() {
    this._save();
  }

  _goBack() {
    this.props.navigation.goBack();
  }

  _visitPaylaAPIRepo() {
    Linking.openURL(PAYLA_API_REPO_URL);
  }

  _save() {
    const dispatch = this.props.dispatch;
    const serviceUrl = this.state.serviceUrl || config.api.baseUrl;

    dispatch(saveSettings({
      api: {
        baseUrl: serviceUrl
      }
    }));
  }

  _onChangeText(text) {
    this.setState({ serviceUrl: text });
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsInput
            value={this.state.serviceUrl}
            placeholder={config.api.baseUrl}
            onChangeText={this._onChangeText.bind(this)}
            onSubmitEditing={this._goBack.bind(this)}
          />
        </SettingsGroup>

        <SettingsDescription>
          The Service URL is used to communicate with an API to retrieve and submit information
          to the blockchain. By default this service is provided by Payla, but you can host your
          own service and enter its URL here.
        </SettingsDescription>

        <SettingsGroup>
          <SettingsButton title='Host Your Own Service' onPress={this._visitPaylaAPIRepo.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

ServiceUrlScreen.propTypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
