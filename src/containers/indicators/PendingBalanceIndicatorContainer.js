/* eslint-disable operator-linebreak */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WarningDotIndicator from '../../components/indicators/WarningDotIndicator';

const mapStateToProps = (state) => ({
  pendingBitcoinBalance: state.bitcoin.wallet.pendingBalance,
  pendingLightningBalance: state.lightning.balance.pending,
  unredeemedLightningBalance: state.lightning.balance.unredeemed
});

class PendingBalanceIndicatorContainer extends PureComponent {
  static BALANCE_TYPE_ONCHAIN = 'onchain';
  static BALANCE_TYPE_OFFCHAIN = 'offchain';
  static BALANCE_TYPE_ALL = 'all';

  static propTypes = {
    pendingBitcoinBalance: PropTypes.number,
    pendingLightningBalance: PropTypes.number,
    unredeemedLightningBalance: PropTypes.number,
    balanceType: PropTypes.oneOf([
      PendingBalanceIndicatorContainer.BALANCE_TYPE_ONCHAIN,
      PendingBalanceIndicatorContainer.BALANCE_TYPE_OFFCHAIN,
      PendingBalanceIndicatorContainer.BALANCE_TYPE_ALL
    ])
  };

  static defaultPropTypes = {
    balanceType: PendingBalanceIndicatorContainer.BALANCE_TYPE_ALL
  };

  _shouldShow() {
    const {
      balanceType,
      pendingBitcoinBalance,
      pendingLightningBalance,
      unredeemedLightningBalance
    } = this.props;

    switch (balanceType) {
      case PendingBalanceIndicatorContainer.BALANCE_TYPE_ONCHAIN:
        return pendingBitcoinBalance > 0;

      case PendingBalanceIndicatorContainer.BALANCE_TYPE_OFFCHAIN:
        return pendingLightningBalance > 0 || unredeemedLightningBalance > 0;

      default:
        return (
          pendingBitcoinBalance > 0 ||
          pendingLightningBalance > 0 ||
          unredeemedLightningBalance > 0
        );
    }
  }

  render() {
    if (!this._shouldShow()) {
      return null;
    }

    return (
      <WarningDotIndicator {...this.props} />
    );
  }
}

const PendingBalanceIndicatorConnector = connect(
  mapStateToProps
)(PendingBalanceIndicatorContainer);

export default PendingBalanceIndicatorConnector;
