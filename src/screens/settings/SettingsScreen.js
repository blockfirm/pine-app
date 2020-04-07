import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

  _showBetaSettings() {
    const { navigation } = this.props;
    navigation.navigate('BetaSettings');
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
          <View style={styles.linkAndDotWrapper}>
            <SettingsLink icon={SettingsLink.ICON_BITCOIN} name='Bitcoin' onPress={this._showBitcoinSettings.bind(this)} />
            <ConnectionIndicatorContainer
              style={styles.connectionWarning}
              connectionType={ConnectionIndicatorContainer.CONNECTION_TYPE_BITCOIN}
            />
          </View>
          <View style={styles.linkAndDotWrapper}>
            <SettingsLink icon={SettingsLink.ICON_LIGHTNING} name='Lightning' onPress={this._showLightningSettings.bind(this)} />
            <ConnectionIndicatorContainer
              style={styles.connectionWarning}
              connectionType={ConnectionIndicatorContainer.CONNECTION_TYPE_LIGHTNING}
            />
          </View>
          <SettingsLink icon={SettingsLink.ICON_BETA} name='Beta' onPress={this._showBetaSettings.bind(this)} isLastItem={true} />
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
