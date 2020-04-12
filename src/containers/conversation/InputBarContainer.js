import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { save as saveSettings } from '../../actions/settings';
import { UNIT_BTC, UNIT_SATOSHIS } from '../../crypto/bitcoin/convert';
import InputBar from '../../components/conversation/InputBar';

const mapStateToProps = (state) => ({
  primaryCurrency: state.settings.currency.primary,
  secondaryCurrency: state.settings.currency.secondary,
  defaultBitcoinUnit: state.settings.bitcoin.unit,
  lastUsedDenomination: state.settings.user.lastUsedDenomination,
  onChainBalance: state.bitcoin.wallet.balance,
  onChainSpendableBalance: state.bitcoin.wallet.spendableBalance,
  offChainBalance: state.lightning.balance.local,
  offChainSpendableBalance: state.lightning.balance.spendable,
  fiatRates: state.bitcoin.fiat.rates
});

class InputBarContainer extends PureComponent {
  static PAYMENT_TYPE_BOTH = InputBar.PAYMENT_TYPE_BOTH;
  static PAYMENT_TYPE_ONCHAIN = InputBar.PAYMENT_TYPE_ONCHAIN;
  static PAYMENT_TYPE_OFFCHAIN = InputBar.PAYMENT_TYPE_OFFCHAIN;

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    primaryCurrency: PropTypes.string.isRequired,
    secondaryCurrency: PropTypes.string.isRequired,
    defaultBitcoinUnit: PropTypes.string.isRequired,
    lastUsedDenomination: PropTypes.shape({
      currency: PropTypes.string,
      unit: PropTypes.string
    }).isRequired,
    initialAmountBtc: PropTypes.number
  };

  constructor() {
    super(...arguments);
    this._onChangeUnit = this._onChangeUnit.bind(this);
  }

  reset() {
    if (this._inputBar) {
      this._inputBar.reset();
    }
  }

  focus() {
    if (this._inputBar) {
      this._inputBar.focus();
    }
  }

  _onChangeUnit({ currency, unit }) {
    const { dispatch } = this.props;

    const newSettings = {
      user: {
        lastUsedDenomination: { currency, unit }
      }
    };

    return dispatch(saveSettings(newSettings));
  }

  _getCurrencyAndUnit() {
    const {
      primaryCurrency,
      secondaryCurrency,
      defaultBitcoinUnit,
      lastUsedDenomination,
      initialAmountBtc
    } = this.props;

    let currency = primaryCurrency;
    let unit = defaultBitcoinUnit;

    if (initialAmountBtc) {
      return { currency: UNIT_BTC, unit };
    }

    if (lastUsedDenomination.currency) {
      if ([primaryCurrency, secondaryCurrency].includes(lastUsedDenomination.currency)) {
        currency = lastUsedDenomination.currency;
      }
    }

    if (lastUsedDenomination.unit) {
      if ([defaultBitcoinUnit, UNIT_BTC, UNIT_SATOSHIS].includes(lastUsedDenomination.unit)) {
        unit = lastUsedDenomination.unit;
      }
    }

    return { currency, unit };
  }

  render() {
    const { currency, unit } = this._getCurrencyAndUnit();

    return (
      <InputBar
        {...this.props}
        ref={ref => { this._inputBar = ref; }}
        currency={currency}
        unit={unit}
        onChangeUnit={this._onChangeUnit}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true }
)(InputBarContainer);
