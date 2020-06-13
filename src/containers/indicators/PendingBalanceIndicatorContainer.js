/* eslint-disable operator-linebreak */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WarningDotIndicator from '../../components/indicators/WarningDotIndicator';
import WarningLightningIndicator from '../../components/indicators/WarningLightningIndicator';

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
    ]),
    withLightningBolt: PropTypes.bool,
    lightningBoltStyle: PropTypes.any
  };

  static defaultProps = {
    balanceType: PendingBalanceIndicatorContainer.BALANCE_TYPE_ALL,
    withLightningBolt: false
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
    const {
      pendingLightningBalance,
      unredeemedLightningBalance,
      withLightningBolt,
      lightningBoltStyle
    } = this.props;

    if (!this._shouldShow()) {
      return null;
    }

    if (withLightningBolt && (pendingLightningBalance > 0 || unredeemedLightningBalance > 0)) {
      return (
        <WarningLightningIndicator
          {...this.props}
          style={lightningBoltStyle}
        />
      );
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
