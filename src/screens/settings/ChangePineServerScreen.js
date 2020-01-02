import React, { Component } from 'react';
import { StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { save as saveSettings } from '../../actions/settings';
import { withTheme } from '../../contexts/theme';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import CancelButton from '../../components/CancelButton';
import HeaderButton from '../../components/buttons/HeaderButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsDescription from '../../components/SettingsDescription';
import SettingsButton from '../../components/SettingsButton';
import SettingsInput from '../../components/SettingsInput';
import PineServerStatus from '../../components/PineServerStatus';
import BaseSettingsScreen from './BaseSettingsScreen';

const PINE_PAYMENT_SERVER_REPO_URL = 'https://github.com/blockfirm/pine-payment-server';

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
class ChangePineServerScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const canSubmit = navigation.getParam('canSubmit');
    const submit = navigation.getParam('submit');

    return {
      headerTransparent: true,
      headerBackground: <SettingsHeaderBackground />,
      headerTitle: <HeaderTitle title='Change Pine Server' />,
      headerLeft: <CancelButton onPress={screenProps.dismiss} />,
      headerRight: <HeaderButton label='Done' onPress={submit} disabled={!canSubmit} />
    };
  };

  constructor(props) {
    super(...arguments);

    this.state = {
      hostname: props.settings.pineAddressHostname
    };

    this._onStatusUpdated = this._onStatusUpdated.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ canSubmit: false });
    this.props.navigation.setParams({ submit: this._onSubmit.bind(this) });
  }

  _onSubmit() {
    const { dispatch, screenProps } = this.props;
    const { hostname } = this.state;

    dispatch(saveSettings({
      pineAddressHostname: hostname
    }));

    screenProps.dismiss();
  }

  _visitPinePaymentServerRepo() {
    Linking.openURL(PINE_PAYMENT_SERVER_REPO_URL);
  }

  _onChangeHostname(hostname) {
    this.setState({ hostname });
    this.props.navigation.setParams({ canSubmit: false });
  }

  _onStatusUpdated(ok) {
    const { settings, navigation } = this.props;
    const oldHostname = settings.pineAddressHostname;
    const newHostname = this.state.hostname;
    const canSubmit = ok && newHostname !== oldHostname;

    navigation.setParams({ canSubmit });
  }

  render() {
    const { settings } = this.props;
    const { hostname } = this.state;

    return (
      <BaseSettingsScreen>
        <SettingsGroup style={styles.group}>
          <SettingsInput
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='email-address'
            value={hostname}
            placeholder={settings.defaultPineAddressHostname}
            onChangeText={this._onChangeHostname.bind(this)}
            onSubmitEditing={this._onSubmit.bind(this)}
            style={styles.input}
          />
          <PineServerStatus
            hostname={hostname || settings.defaultPineAddressHostname}
            onStatusUpdated={this._onStatusUpdated}
            style={styles.serverStatus}
          />
        </SettingsGroup>
        <SettingsDescription>
          Enter the domain name of your Pine server. The Pine server does not have any access to
          your bitcoins. It is only used for relaying end-to-end encrypted payments and storing your
          Pine contacts and public profile.
        </SettingsDescription>

        <SettingsGroup>
          <SettingsButton
            title='Host Your Own Pine Server'
            onPress={this._visitPinePaymentServerRepo.bind(this)}
            isLastItem={true}
          />
        </SettingsGroup>
        <SettingsDescription>
          A Pine server is similar to an email server. You can set up your own with your own domain
          for yourself, your family or company, or you can use the one provided by Pine and get an
          @pine.pm address. Hosting your own Pine server requires technical skills to set up,
          configure and maintain.
        </SettingsDescription>
      </BaseSettingsScreen>
    );
  }
}

ChangePineServerScreen.propTypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  screenProps: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default withTheme(ChangePineServerScreen);
