import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import config from '../../config';
import ConnectionIndicatorContainer from '../../containers/indicators/ConnectionIndicatorContainer';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import DoneButton from '../../components/DoneButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import SettingsUserLink from '../../components/SettingsUserLink';
import BaseSettingsScreen from './BaseSettingsScreen';

const styles = StyleSheet.create({
  linkAndDotWrapper: {
    justifyContent: 'center'
  },
  connectionWarning: {
    position: 'absolute',
    right: 35
  }
});

@connect((state) => ({
  settings: state.settings
}))
export default class SettingsScreen extends Component {
  static navigationOptions = ({ screenProps }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='Settings' />,
    headerBackTitle: null,
    headerRight: <DoneButton onPress={screenProps.dismiss} />
  });

  _showProfile() {
    const { navigation } = this.props;
    navigation.navigate('Profile');
  }

  _showGeneralSettings() {
    const { navigation } = this.props;
    navigation.navigate('GeneralSettings');
  }

  _showBitcoinSettings() {
    const { navigation } = this.props;
    navigation.navigate('BitcoinSettings');
  }

  _showLightningSettings() {
    const { navigation } = this.props;
    navigation.navigate('LightningSettings');
  }

  _showStatus() {
    const { navigation } = this.props;
    navigation.navigate('Status');
  }

  render() {
    const userProfile = this.props.settings.user.profile;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsUserLink user={userProfile} onPress={this._showProfile.bind(this)} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsLink icon={SettingsLink.ICON_GEAR} name='General' onPress={this._showGeneralSettings.bind(this)} />
          <SettingsLink icon={SettingsLink.ICON_BITCOIN} name='Bitcoin' onPress={this._showBitcoinSettings.bind(this)} />

          {
            config.lightning.enabled ?
              <SettingsLink
                icon={SettingsLink.ICON_LIGHTNING}
                name='Lightning'
                value='Beta'
                onPress={this._showLightningSettings.bind(this)}
              />
            : null
          }

          <View style={styles.linkAndDotWrapper}>
            <SettingsLink
              icon={SettingsLink.ICON_STATUS}
              name='Status'
              onPress={this._showStatus.bind(this)}
              isLastItem={true}
            />
            <ConnectionIndicatorContainer style={styles.connectionWarning} />
          </View>
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

SettingsScreen.propTypes = {
  settings: PropTypes.object,
  screenProps: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
