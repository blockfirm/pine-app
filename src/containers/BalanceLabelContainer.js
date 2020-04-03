import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { normalizeBtcAmount, satsToBtc } from '../crypto/bitcoin';
import BtcLabel from '../components/BtcLabel';
import CurrencyLabelContainer from './CurrencyLabelContainer';

const mapStateToProps = (state) => ({
  balance: state.bitcoin.wallet.balance, // On-chain balance is in BTC.
  lightningBalance: state.lightning.balance // Off-chain balances are in sats.
});

class BalanceLabelContainer extends Component {
  static propTypes = {
    balance: PropTypes.number,
    lightningBalance: PropTypes.object,
    unit: PropTypes.string
  };

  getTotalBalance() {
    const { balance, lightningBalance } = this.props;
    const totalLightningBalance = lightningBalance.local + lightningBalance.commitFee + lightningBalance.unredeemed;
    const totalLightningBalanceBtc = satsToBtc(totalLightningBalance);
    const totalBtc = normalizeBtcAmount(balance + totalLightningBalanceBtc);

    return totalBtc;
  }

  render() {
    const { unit } = this.props;
    const totalBalance = this.getTotalBalance();

    if (unit) {
      return (
        <BtcLabel
          {...this.props}
          amount={totalBalance}
        />
      );
    }

    return (
      <CurrencyLabelContainer
        {...this.props}
        amountBtc={totalBalance}
      />
    );
  }
}

const BalanceLabelConnector = connect(
  mapStateToProps
)(BalanceLabelContainer);

export default BalanceLabelConnector;
