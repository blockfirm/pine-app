/* eslint-disable max-lines */
import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { UNIT_BTC, UNIT_SATOSHIS, convert as convertBitcoin } from '../../crypto/bitcoin/convert';
import { save as saveSettings } from '../../actions/settings';
import { FEE_LEVEL_CUSTOM, getEstimate as getFeeEstimate, adjustFeeRate } from '../../actions/bitcoin/fees/getEstimate';
import headerStyles from '../../styles/headerStyles';
import settingsStyles from '../../styles/settingsStyles';
import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import BackButton from '../../components/BackButton';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsOption from '../../components/SettingsOption';
import SettingsLink from '../../components/SettingsLink';
import SettingsDescription from '../../components/SettingsDescription';
import SettingsTitle from '../../components/SettingsTitle';
import StrongText from '../../components/StrongText';
import StyledText from '../../components/StyledText';
import BaseSettingsScreen from './BaseSettingsScreen';
import config from '../../config';

const AVERAGE_TRANSACTION_SIZE_BYTES = 225;
const ERROR_COLOR = '#FF3B30';

const styles = StyleSheet.create({
  fees: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bullet: {
    marginHorizontal: 10,
    height: 3,
    width: 3,
    borderRadius: 2,
    backgroundColor: '#8A8A8F'
  },
  fiat: {
    color: '#8A8A8F'
  }
});

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
      level: props.settings.bitcoin.fee.level,
      estimatedFeeRate: null,
      couldNotGetFeeRate: false
    };
  }

  componentDidMount() {
    this._loadFeeRate();
  }

  componentWillUnmount() {
    this._save();
  }

  _loadFeeRate() {
    const dispatch = this.props.dispatch;
    const ignoreFeeLevel = true;

    this.setState({ couldNotGetFeeRate: false });

    dispatch(getFeeEstimate(1, ignoreFeeLevel))
      .then((satoshisPerByte) => {
        this.setState({ estimatedFeeRate: satoshisPerByte });
      })
      .catch(() => {
        this.setState({ couldNotGetFeeRate: true });
      });
  }

  _getEstimatedFee() {
    const estimatedFeeRate = this.state.estimatedFeeRate || 0;
    const { level } = this.state;
    const adjustedFeeRate = adjustFeeRate(estimatedFeeRate, level);

    if (level.toLowerCase() === FEE_LEVEL_CUSTOM) {
      return this.props.settings.bitcoin.fee.satoshisPerByte * AVERAGE_TRANSACTION_SIZE_BYTES;
    }

    return adjustedFeeRate * AVERAGE_TRANSACTION_SIZE_BYTES;
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

  _renderEstimatedFee() {
    const { estimatedFeeRate, couldNotGetFeeRate } = this.state;

    if (couldNotGetFeeRate) {
      return (
        <TouchableOpacity onPress={this._loadFeeRate.bind(this)}>
          <StyledText style={[settingsStyles.label, { color: ERROR_COLOR }]}>Could not estimate fee.</StyledText>
        </TouchableOpacity>
      );
    }

    if (estimatedFeeRate === null) {
      return <ActivityIndicator size='small' />;
    }

    const estimatedFee = this._getEstimatedFee();
    const estimatedFeeBtc = convertBitcoin(estimatedFee, UNIT_SATOSHIS, UNIT_BTC);

    return (
      <View style={styles.fees}>
        <CurrencyLabelContainer amountBtc={estimatedFeeBtc} currencyType='primary' style={settingsStyles.label} />
        <View style={styles.bullet} />
        <CurrencyLabelContainer amountBtc={estimatedFeeBtc} currencyType='secondary' style={[settingsStyles.label, styles.fiat]} />
      </View>
    );
  }

  render() {
    const feeSettings = this.props.settings.bitcoin.fee;
    const satoshisPerByte = feeSettings.satoshisPerByte;

    return (
      <BaseSettingsScreen>
        <SettingsTitle>
          Estimated Fee
        </SettingsTitle>
        <SettingsGroup>
          <View style={[settingsStyles.item, { borderBottomWidth: 0, alignItems: 'center' }]}>
            {this._renderEstimatedFee()}
          </View>
        </SettingsGroup>
        <SettingsDescription>
          This is an estimated transaction fee using the selected fee level below.
        </SettingsDescription>

        <SettingsTitle>
          Fee Level
        </SettingsTitle>
        <SettingsGroup>
          <SettingsOption name='High' value={this.state.level} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Normal' value={this.state.level} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Low' value={this.state.level} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Very Low' value={this.state.level} onSelect={this._onSelect.bind(this)} />
          <SettingsOption name='Custom' value={this.state.level} onSelect={this._onSelect.bind(this)} isLastItem={true} />
        </SettingsGroup>

        {
          this.state.level.toLowerCase() === FEE_LEVEL_CUSTOM ?
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
          <StrongText>Normal</StrongText> is 100% of the estimated fee of getting confirmed in the next block (~10 minutes).
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
