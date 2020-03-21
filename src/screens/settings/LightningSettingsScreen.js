import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTheme } from '../../contexts/theme';
import settingsStyles from '../../styles/settingsStyles';
import LightningConnectionStatusContainer from '../../containers/LightningConnectionStatusContainer';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';

@connect()
class LightningSettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='Lightning' />,
    headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />
  });

  _showOffChainBalance() {
    const { navigation } = this.props;
    navigation.navigate('OffChainBalance');
  }

  render() {
    const { theme } = this.props;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <View
            style={[settingsStyles.item, theme.settingsItem, { borderBottomWidth: 0, alignItems: 'center' }]}
          >
            <LightningConnectionStatusContainer />
          </View>
        </SettingsGroup>

        <SettingsGroup>
          <SettingsLink name='Balance & Capacity' onPress={this._showOffChainBalance.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

LightningSettingsScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme(LightningSettingsScreen);
