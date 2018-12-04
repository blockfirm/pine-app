import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { save as saveSettings } from '../../actions/settings';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsInput from '../../components/SettingsInput';
import SettingsDescription from '../../components/SettingsDescription';
import BaseSettingsScreen from './BaseSettingsScreen';
import config from '../../config';

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
          The URL should start with “https://” and end with “/v1”.
        </SettingsDescription>
      </BaseSettingsScreen>
    );
  }
}

ServiceUrlScreen.propTypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
