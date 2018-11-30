import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { save as saveSettings } from '../../actions/settings/save';
import headerStyles from '../../styles/headerStyles';
import settingsStyles from '../../styles/settingsStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsOption from '../../components/SettingsOption';
import SettingsDescription from '../../components/SettingsDescription';
import SettingsTitle from '../../components/SettingsTitle';
import StrongText from '../../components/StrongText';
import BtcLabel from '../../components/BtcLabel';
import BaseSettingsScreen from './BaseSettingsScreen';
import config from '../../config';

@connect((state) => ({
  settings: state.settings,
  balance: state.bitcoin.wallet.balance
}))
export default class BitcoinUnitScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Bitcoin Display Unit',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  constructor(props) {
    super(...arguments);

    this.state = {
      unit: props.settings.bitcoin.unit
    };
  }

  componentWillUnmount() {
    this._save();
  }

  _save() {
    const dispatch = this.props.dispatch;
    const unit = this.state.unit || config.bitcoin.unit;

    dispatch(saveSettings({
      bitcoin: { unit }
    }));
  }

  _onSelect(unit) {
    this.setState({ unit });
  }

  render() {
    return (
      <BaseSettingsScreen>
        <SettingsTitle>Balance Preview</SettingsTitle>
        <SettingsGroup>
          <View style={[settingsStyles.item, { borderBottomWidth: 0, alignItems: 'center' }]}>
            <BtcLabel amount={this.props.balance} unit={this.state.unit} style={settingsStyles.label} />
          </View>
        </SettingsGroup>
        <SettingsDescription>
          This is how your current wallet balance will look like with the selected unit below.
        </SettingsDescription>

        <SettingsTitle>Display Unit</SettingsTitle>
        <SettingsGroup>
          <SettingsOption name='BTC' value={this.state.unit} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='mBTC' value={this.state.unit} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Satoshis' value={this.state.unit} onSelect={this._onSelect.bind(this)} isLastItem={true} />
        </SettingsGroup>

        <SettingsDescription>
          Choose the unit in which bitcoin amounts should be displayed.
        </SettingsDescription>
        <SettingsDescription />
        <SettingsDescription>
          <StrongText>BTC</StrongText> is one bitcoin and will be displayed as BTC.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>mBTC</StrongText> is one thousandth of a bitcoin and will be displayed as mBTC.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Satoshi</StrongText> is one hundred millionth of a bitcoin and will be displayed as sats.
        </SettingsDescription>
      </BaseSettingsScreen>
    );
  }
}

BitcoinUnitScreen.propTypes = {
  settings: PropTypes.object,
  balance: PropTypes.number,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
