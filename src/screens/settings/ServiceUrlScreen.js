import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { save as saveSettings } from '../../actions/settings';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsInput from '../../components/SettingsInput';
import SettingsDescription from '../../components/SettingsDescription';
import BitcoinServiceStatus from '../../components/BitcoinServiceStatus';
import BaseSettingsScreen from './BaseSettingsScreen';
import config from '../../config';

const styles = StyleSheet.create({
  group: {
    justifyContent: 'center'
  },
  input: {
    marginRight: 26
  },
  serverStatus: {
    position: 'absolute',
    right: 16
  }
});

@connect((state) => ({
  settings: state.settings
}))
export default class ServiceUrlScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='Service URL' />,
    headerLeft: <BackButton onPress={() => navigation.goBack()} />
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

  _save() {
    const dispatch = this.props.dispatch;
    let serviceUrl = this.state.serviceUrl || config.api.baseUrl;

    // Remove trailing slash.
    serviceUrl = serviceUrl.replace(/\/$/, '');

    dispatch(saveSettings({
      api: {
        baseUrl: serviceUrl
      }
    }));
  }

  _onChangeServiceUrl(serviceUrl) {
    this.setState({
      serviceUrl: serviceUrl.trim()
    });
  }

  render() {
    const { navigation, settings } = this.props;

    return (
      <BaseSettingsScreen>
        <SettingsGroup style={styles.group}>
          <SettingsInput
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.serviceUrl}
            placeholder={config.api.baseUrl}
            onChangeText={this._onChangeServiceUrl.bind(this)}
            onSubmitEditing={() => navigation.goBack()}
            style={styles.input}
          />
          <BitcoinServiceStatus
            serviceUrl={this.state.serviceUrl || config.api.baseUrl}
            bitcoinNetwork={settings.bitcoin.network}
            style={styles.serverStatus}
          />
        </SettingsGroup>

        <SettingsDescription>
          The URL should start with “https://”.
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
