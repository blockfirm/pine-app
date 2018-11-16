import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { save as saveSettings } from '../../actions/settings';
import headerStyles from '../../styles/headerStyles';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsOption from '../../components/SettingsOption';
import SettingsLink from '../../components/SettingsLink';
import SettingsDescription from '../../components/SettingsDescription';
import StrongText from '../../components/StrongText';
import BaseSettingsScreen from './BaseSettingsScreen';
import config from '../../config';

@connect((state) => ({
  settings: state.settings
}))
export default class BitcoinFeeSettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Transaction Fees',
    headerStyle: headerStyles.header,
    headerTitleStyle: headerStyles.title,
    headerLeft: (<BackButton onPress={() => { navigation.goBack(); }} />)
  });

  constructor(props) {
    super(...arguments);

    this.state = {
      level: props.settings.bitcoin.fee.level
    };
  }

  componentWillUnmount() {
    this._save();
  }

  _save() {
    const dispatch = this.props.dispatch;
    const level = this.state.level || config.bitcoin.fee.level;

    dispatch(saveSettings({
      bitcoin: {
        fee: { level }
      }
    }));
  }

  _showSatoshisPerByteScreen() {
    const navigation = this.props.navigation;
    navigation.navigate('SatoshisPerByte');
  }

  _onSelect(level) {
    this.setState({ level });
  }

  render() {
    const feeSettings = this.props.settings.bitcoin.fee;
    const satoshisPerByte = feeSettings.satoshisPerByte;

    return (
      <BaseSettingsScreen>
        <SettingsGroup>
          <SettingsOption name='High' value={this.state.level} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Normal' value={this.state.level} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Low' value={this.state.level} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Very Low' value={this.state.level} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Custom' value={this.state.level} onSelect={this._onSelect.bind(this)} isLastItem={true} />
        </SettingsGroup>

        {
          this.state.level === 'Custom' ?
            (
              <SettingsGroup>
                <SettingsLink
                  name='Satoshis Per Byte'
                  value={satoshisPerByte.toString()}
                  onPress={this._showSatoshisPerByteScreen.bind(this)}
                  isLastItem={true}
                />
              </SettingsGroup>
            )
            : null
        }

        <SettingsDescription>
          Choose the preferred transaction fee level. Higher level means higher probability of getting
          confirmed in the next block. Choosing a low or custom level might leave your transaction
          in an unconfirmed state for a long time.
        </SettingsDescription>

        <SettingsDescription />

        <SettingsDescription>
          <StrongText>High</StrongText> is 150% of the normal fee.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Normal</StrongText> is 100% of the estimated fee of getting confirmed in the next block (~10 mins).
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Low</StrongText> is 50% of the normal fee.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Very Low</StrongText> is 25% of the normal fee.
        </SettingsDescription>

        <SettingsDescription />

        <SettingsDescription>
          All fees goes to the miner who mines the block containing your transaction. Pine or its
          developers does not charge any fees.
        </SettingsDescription>
      </BaseSettingsScreen>
    );
  }
}

BitcoinFeeSettingsScreen.propTypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func,
  navigation: PropTypes.any
};
