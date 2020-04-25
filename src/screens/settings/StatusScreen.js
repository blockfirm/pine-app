import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import parseAddress from '../../clients/paymentServer/address/parse';
import { withTheme } from '../../contexts/theme';
import settingsStyles from '../../styles/settingsStyles';
import PineConnectionStatusContainer from '../../containers/statuses/PineConnectionStatusContainer';
import LightningConnectionStatusContainer from '../../containers/statuses/LightningConnectionStatusContainer';
import BitcoinConnectionStatusContainer from '../../containers/statuses/BitcoinConnectionStatusContainer';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsTitle from '../../components/SettingsTitle';
import SettingsDescription from '../../components/SettingsDescription';
import BaseSettingsScreen from './BaseSettingsScreen';

const styles = StyleSheet.create({
  statusWrapper: {
    borderBottomWidth: 0,
    alignItems: 'center'
  }
});

@connect((state) => ({
  settings: state.settings
}))
class StatusScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='Status' />,
    headerLeft: <BackButton onPress={() => navigation.goBack()} />
  });

  _getPineHostname() {
    const { settings } = this.props;
    const { hostname } = parseAddress(settings.user.profile.address);

    return hostname;
  }

  _getBitcoinServiceHostname() {
    const { settings } = this.props;
    const matches = settings.api.baseUrl.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);

    return matches && matches[1];
  }

  render() {
    const { theme } = this.props;
    const pineHostname = this._getPineHostname();
    const bitcoinServiceHostname = this._getBitcoinServiceHostname();

    const statusWrapperStyle = [
      settingsStyles.item,
      theme.settingsItem,
      styles.statusWrapper
    ];

    return (
      <BaseSettingsScreen>
        <SettingsTitle label={pineHostname.toLowerCase()}>
          Pine Server
        </SettingsTitle>
        <SettingsGroup>
          <View style={statusWrapperStyle}>
            <PineConnectionStatusContainer />
          </View>
        </SettingsGroup>
        <SettingsDescription>
          The Pine Server stores your Pine profile and contacts, and
          relays end-to-end encrypted bitcoin payments between Pine users.
        </SettingsDescription>

        <SettingsTitle label={bitcoinServiceHostname.toLowerCase()}>
          Bitcoin Service
        </SettingsTitle>
        <SettingsGroup>
          <View style={statusWrapperStyle}>
            <BitcoinConnectionStatusContainer />
          </View>
        </SettingsGroup>
        <SettingsDescription>
          The Bitcoin Service is used to retrieve and submit information
          to the bitcoin network. It does not have any access to your bitcoins.
        </SettingsDescription>

        <SettingsTitle label={pineHostname.toLowerCase()}>
          Lightning Service
        </SettingsTitle>
        <SettingsGroup>
          <View style={statusWrapperStyle}>
            <LightningConnectionStatusContainer />
          </View>
        </SettingsGroup>
        <SettingsDescription>
          The Lightning Service provides non-custodial access to the Lightning Network
          without exposing your private keys. Transactions are securely signed on the device.
        </SettingsDescription>
      </BaseSettingsScreen>
    );
  }
}

StatusScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  settings: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default withTheme(StatusScreen);
