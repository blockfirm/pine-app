import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import config from '../../config';
import { withTheme } from '../../contexts/theme';
import normalizeBtcAmount from '../../crypto/bitcoin/normalizeBtcAmount';
import SettingsHeaderBackground from '../../components/SettingsHeaderBackground';
import HeaderTitle from '../../components/HeaderTitle';
import settingsStyles from '../../styles/settingsStyles';
import BackButton from '../../components/BackButton';
import DoneButton from '../../components/DoneButton';
import SettingsTitle from '../../components/SettingsTitle';
import SettingsDescription from '../../components/SettingsDescription';
import SettingsGroup from '../../components/SettingsGroup';
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

const getBalanceAggregates = (utxos) => {
  return utxos.reduce((sums, utxo) => {
    if (utxo.reserved) {
      sums.reserved = normalizeBtcAmount(sums.reserved + utxo.value);
    } else if (utxo.confirmed || utxo.internal) {
      sums.spendable = normalizeBtcAmount(sums.spendable + utxo.value);
    } else {
      sums.pending = normalizeBtcAmount(sums.pending + utxo.value);
    }

    if (utxo.reserved && utxo.reservedBtcAmount) {
      sums.total = normalizeBtcAmount(sums.total + utxo.value - utxo.reservedBtcAmount);
    } else {
      sums.total = normalizeBtcAmount(sums.total + utxo.value);
    }

    return sums;
  }, {
    spendable: 0,
    total: 0,
    pending: 0,
    reserved: 0
  });
};

const getCoinAggregates = (utxos) => {
  return utxos.reduce((sums, utxo) => {
    if (utxo.reserved) {
      sums.reserved++;
    } else if (utxo.confirmed || utxo.internal) {
      sums.spendable++;
    } else {
      sums.pending++;
    }

    sums.total++;

    return sums;
  }, {
    spendable: 0,
    total: 0,
    pending: 0,
    reserved: 0
  });
};

@connect((state) => ({
  utxos: state.bitcoin.wallet.utxos.items
}))
class OnChainBalanceScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const isModal = navigation.getParam('isModal') || false;

    return {
      headerTransparent: true,
      headerBackground: <SettingsHeaderBackground />,
      headerTitle: <HeaderTitle title={config.lightning.enabled ? 'On-chain Balance' : 'Wallet Balance'} />,
      headerLeft: isModal ? null : <BackButton onPress={() => { navigation.goBack(); }} />,
      headerRight: isModal ? <DoneButton onPress={screenProps.dismiss} /> : null
    };
  };

  constructor(props) {
    super(...arguments);

    const { utxos } = props;
    const balances = getBalanceAggregates(utxos);
    const coins = getCoinAggregates(utxos);

    this.state = { balances, coins };
  }

  render() {
    const { theme } = this.props;
    const { balances, coins } = this.state;

    const balanceData = [
      { label: 'Spendable', color: theme.walletBalanceSpendableColor, value: balances.spendable },
      { label: 'Pending', color: theme.walletBalancePendingColor, value: balances.pending },
      { label: 'Reserved', color: theme.walletBalanceReservedColor, value: balances.reserved }
    ];

    const coinData = [
      { label: 'Spendable', color: theme.walletBalanceSpendableColor, value: coins.spendable },
      { label: 'Pending', color: theme.walletBalancePendingColor, value: coins.pending },
      { label: 'Reserved', color: theme.walletBalanceReservedColor, value: coins.reserved }
    ];

    return (
      <BaseSettingsScreen>
        <SettingsTitle>Balance</SettingsTitle>
        <SettingsGroup>
          <View style={[settingsStyles.item, styles.wrapper]}>
            <StyledText style={styles.chartTitle}>
              <CurrencyLabelContainer
                amountBtc={balances.spendable}
                currencyType='primary'
                style={styles.spendableText}
              />
              &nbsp;of&nbsp;
              <CurrencyLabelContainer
                amountBtc={balances.total}
                currencyType='primary'
                style={styles.spendableText}
              />
              &nbsp;Spendable
            </StyledText>
            <StackedBarChart data={balanceData} />
          </View>
        </SettingsGroup>

        <SettingsDescription>
          <StrongText>Spendable</StrongText> balance includes confirmed payments and unconfirmed change.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Pending</StrongText> balance includes unconfirmed incoming payments.
        </SettingsDescription>
        <SettingsDescription>
          <StrongText>Reserved</StrongText> balance includes coins that have been reserved for outgoing payments
          but have not yet been broadcasted by its recepients. It doesn't include the amount that was sent.
          It will be available once the recipient has received the payment or the payment has been canceled.
        </SettingsDescription>

        <SettingsTitle>Coins</SettingsTitle>
        <SettingsGroup>
          <View style={[settingsStyles.item, styles.wrapper]}>
            <StyledText style={styles.chartTitle}>
              {coins.spendable} of {coins.total} Coins Spendable
            </StyledText>
            <StackedBarChart data={coinData} />
          </View>
        </SettingsGroup>

        <SettingsDescription>
          Whole coins must be used when making payments which means that the reserved amount will
          likely be higher than the actual sent amount. The difference will be spendable as soon
          as the transaction has been broadcasted and change coins have been received.
        </SettingsDescription>
      </BaseSettingsScreen>
    );
  }
}

OnChainBalanceScreen.propTypes = {
  dispatch: PropTypes.func,
  navigation: PropTypes.any,
  utxos: PropTypes.arrayOf(PropTypes.object),
  theme: PropTypes.object.isRequired
};

export default withTheme(OnChainBalanceScreen);
