import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { normalizeBtcAmount, convert, UNIT_BTC, UNIT_SATOSHIS } from '../crypto/bitcoin';
import CurrencyLabelContainer from './CurrencyLabelContainer';

const mapStateToProps = (state) => {
  return {
    balance: state.bitcoin.wallet.balance, // On-chain balance is in BTC.
    lightningBalance: state.lightning.balance.local // Off-chain balance is in sats.
  };
};

class BalanceLabelContainer extends Component {
  static propTypes = {
    balance: PropTypes.number,
    lightningBalance: PropTypes.number
  };

  getTotalBalance() {
    const { balance, lightningBalance } = this.props;
    const lightningBalanceBtc = convert(lightningBalance, UNIT_SATOSHIS, UNIT_BTC);
    const totalBtc = balance + lightningBalanceBtc;

    return normalizeBtcAmount(totalBtc);
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
