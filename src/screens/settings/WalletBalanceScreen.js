/* eslint-disable lines-around-comment */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTheme } from '../../contexts/theme';
import { normalizeBtcAmount, satsToBtc } from '../../crypto/bitcoin';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import settingsStyles from '../../styles/settingsStyles';
import DoneButton from '../../components/DoneButton';
import SettingsTitle from '../../components/SettingsTitle';
import SettingsDescription from '../../components/SettingsDescription';
import SettingsGroup from '../../components/SettingsGroup';
import SettingsLink from '../../components/SettingsLink';
import StyledText from '../../components/StyledText';
import StrongText from '../../components/StrongText';
import StackedBarChart from '../../components/charts/StackedBarChart';
import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import BaseSettingsScreen from './BaseSettingsScreen';

const styles = StyleSheet.create({
  wrapper: {
    height: null,
    borderBottomWidth: 0,
    justifyContent: 'center',
    paddingRight: 0,
    marginRight: 15,
    marginVertical: 15
  },
  chartTitle: {
    fontSize: 15
  }
});

@connect((state) => ({
  // On-chain balances are in BTC.
  bitcoinBalance: state.bitcoin.wallet.balance,
  spendableBitcoinBalance: state.bitcoin.wallet.spendableBalance,

  // Off-chain balances are in sats.
  lightningBalance: state.lightning.balance
}))
class WalletBalanceScreen extends Component {
  static navigationOptions = ({ screenProps }) => ({
    headerTransparent: true,
    headerBackground: <SettingsHeaderBackground />,
    headerTitle: <HeaderTitle title='Wallet Balance' />,
    headerBackTitle: null,
    headerRight: <DoneButton onPress={screenProps.dismiss} />
  });

  _showOnChainBalance() {
    const { navigation } = this.props;
    navigation.navigate('OnChainBalance');
  }

  _showOffChainBalance() {
    const { navigation } = this.props;
    navigation.navigate('OffChainBalance');
  }

  render() {
    const { theme, bitcoinBalance, spendableBitcoinBalance, lightningBalance } = this.props;
    const totalLightningBalance = lightningBalance.local + lightningBalance.commitFee + lightningBalance.unredeemed;
    const totalLightningBalanceBtc = satsToBtc(totalLightningBalance);
    const localLightningBalanceBtc = satsToBtc(lightningBalance.local);
    const spendableLightningBalanceBtc = lightningBalance.pending ? 0 : localLightningBalanceBtc;
    const totalBtc = normalizeBtcAmount(bitcoinBalance + totalLightningBalanceBtc);
    const spendableBtc = normalizeBtcAmount(spendableBitcoinBalance + spendableLightningBalanceBtc);

    const balanceData = [
      { label: 'On-chain', color: theme.walletBalanceOnChainColor, value: bitcoinBalance },
      { label: 'Off-chain', color: theme.walletBalanceOffChainColor, value: totalLightningBalanceBtc }
    ];

    return (
      <BaseSettingsScreen>
        <SettingsTitle>Balance</SettingsTitle>
        <SettingsGroup>
          <View style={[settingsStyles.item, styles.wrapper]}>
            <StyledText style={styles.chartTitle}>
              <CurrencyLabelContainer
                amountBtc={spendableBtc}
                currencyType='primary'
                style={styles.spendableText}
              />
              &nbsp;of&nbsp;
              <CurrencyLabelContainer
                amountBtc={totalBtc}
                currencyType='primary'
                style={styles.spendableText}
              />
              &nbsp;Spendable
            </StyledText>
            <StackedBarChart data={balanceData} />
          </View>
        </SettingsGroup>

        <SettingsDescription>
          <StrongText>On-chain</StrongText> balance is your bitcoin stored on the blockchain.
          This type of balance is the safest but transactions are slower and more expensive.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Off-chain</StrongText> balance is your bitcoin stored in Lightning payment channels.
          This type of balance is faster and cheaper, but less secure than on-chain.
        </SettingsDescription>

        <SettingsGroup>
          <SettingsLink name='On-chain' onPress={this._showOnChainBalance.bind(this)} />
          <SettingsLink name='Off-chain' onPress={this._showOffChainBalance.bind(this)} isLastItem={true} />
        </SettingsGroup>
      </BaseSettingsScreen>
    );
  }
}

WalletBalanceScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  bitcoinBalance: PropTypes.number,
  spendableBitcoinBalance: PropTypes.number,
  lightningBalance: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default withTheme(WalletBalanceScreen);
