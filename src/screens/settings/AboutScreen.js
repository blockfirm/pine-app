import React, { Component } from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsAttribute from '../../components/SettingsAttribute';
import SettingsButton from '../../components/SettingsButton';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';

const packageJson = require('../../../package.json');
const KEY_DERIVATION_SCHEME = 'BIP49';
const BIP49_ACCOUNT_INDEX = 0;

@connect()
export default class AboutScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='About' />,
    headerLeft: <BackButton onPress={() => { navigation.goBack(); }} />
  });

  _showTermsAndConditions() {
    const navigation = this.props.navigation;
    navigation.navigate('TermsAndConditions');
  }

  _showPrivacyPolicy() {
    const navigation = this.props.navigation;
    navigation.navigate('PrivacyPolicy');
  }

  _visitWebsite() {
    Linking.openURL(packageJson.website);
  }

  _reportIssue() {
    Linking.openURL(packageJson.bugs);
  }

  _viewSourceCode() {
    Linking.openURL(packageJson.repository.url);
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsAttribute name='Version' value={packageJson.version} />
          <SettingsAttribute name='Copyright' value={packageJson.copyright} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsAttribute name='Key Derivation Scheme' value={KEY_DERIVATION_SCHEME} />
          <SettingsAttribute name='BIP49 Account Index' value={BIP49_ACCOUNT_INDEX.toString()} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsLink name='Terms and Conditions' onPress={this._showTermsAndConditions.bind(this)} />
          <SettingsLink name='Privacy Policy' onPress={this._showPrivacyPolicy.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsButton title='Visit Website' onPress={this._visitWebsite.bind(this)} />
          <SettingsButton title='Report Issue' onPress={this._reportIssue.bind(this)} />
          <SettingsButton title='View Source Code' onPress={this._viewSourceCode.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

AboutScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
