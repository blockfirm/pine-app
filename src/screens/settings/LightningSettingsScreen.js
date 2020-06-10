import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
    headerLeft: <BackButton onPress={() => navigation.goBack()} />
  });

  _showOffChainBalance() {
    const { navigation } = this.props;
    navigation.navigate('OffChainBalance');
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsLink name='Balance &amp; Capacity' onPress={this._showOffChainBalance.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

LightningSettingsScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};

export default LightningSettingsScreen;
