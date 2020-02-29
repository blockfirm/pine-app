import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { normalizeBtcAmount, satsToBtc } from '../crypto/bitcoin';
import CurrencyLabelContainer from './CurrencyLabelContainer';

const mapStateToProps = (state) => {
  return {
    balance: state.bitcoin.wallet.balance, // On-chain balance is in BTC.
    lightningBalance: state.lightning.balance // Off-chain balances are in sats.
  };
};

class BalanceLabelContainer extends Component {
  static propTypes = {
    balance: PropTypes.number,
    lightningBalance: PropTypes.object
  };

  getTotalBalance() {
    const { balance, lightningBalance } = this.props;
    const lightningBalanceBtc = satsToBtc(lightningBalance.local + lightningBalance.commitFee);
    const totalBtc = normalizeBtcAmount(balance + lightningBalanceBtc);

    return totalBtc;
  }

  render() {
    const totalBalance = this.getTotalBalance();

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
