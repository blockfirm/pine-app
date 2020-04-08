import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTheme } from '../../contexts/theme';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import settingsStyles from '../../styles/settingsStyles';
import BitcoinConnectionStatusContainer from '../../containers/BitcoinConnectionStatusContainer';
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
class BitcoinServiceScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='Bitcoin Service' />,
    headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />
  });

  _visitPineAPIRepo() {
    Linking.openURL(PINE_API_REPO_URL);
  }

  _showServiceUrlScreen() {
    const navigation = this.props.navigation;
    navigation.navigate('ServiceUrl');
  }

  render() {
    const { settings, theme } = this.props;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <View
            style={[settingsStyles.item, theme.settingsItem, { borderBottomWidth: 0, alignItems: 'center' }]}
          >
            <BitcoinConnectionStatusContainer />
          </View>
        </SettingsGroup>

        <SettingsGroup>
          <SettingsLink name='Service URL' value={settings.api.baseUrl} onPress={this._showServiceUrlScreen.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsDescription>
          The Service URL is used to communicate with an API to retrieve and submit information
          to the bitcoin network. By default this service is provided by Pine, but you can
          host your own service and enter its URL here to gain extra privacy and control. This
          server does not have any access to your bitcoins.
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
  navigation: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme(BitcoinServiceScreen);
