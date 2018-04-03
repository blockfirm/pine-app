import React, { Component } from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsAttribute from '../../components/SettingsAttribute';
import SettingsButton from '../../components/SettingsButton';
import SettingsLink from '../../components/SettingsLink';
import BaseSettingsScreen from './BaseSettingsScreen';

const packageJson = require('../../../package.json');

@connect()
export default class AboutScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'About',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  _showTermsAndConditions() {
    const navigation = this.props.navigation;
    navigation.navigate('TermsAndConditions');
  }

  _visitWebsite() {
    Linking.openURL(packageJson.website);
  }

  _reportIssue() {
    Linking.openURL(packageJson.bugs);
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsAttribute name='Version' value={packageJson.version} />
          <SettingsAttribute name='Copyright' value={packageJson.copyright} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsLink name='Terms and Conditions' onPress={this._showTermsAndConditions.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsGroup>
          <SettingsButton title='Visit Website' onPress={this._visitWebsite.bind(this)} />
          <SettingsButton title='Report Issue' onPress={this._reportIssue.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

AboutScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
