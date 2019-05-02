import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FiatLabel from '../components/FiatLabel';
import BtcLabelContainer from './BtcLabelContainer';

const CURRENCY_BTC = 'BTC';

export const CURRENCY_TYPE_PRIMARY = 'primary';
export const CURRENCY_TYPE_SECONDARY = 'secondary';

const mapStateToProps = (state) => {
  return {
    fiatRates: state.bitcoin.fiat.rates,
    settings: state.settings
  };
};

class CurrencyLabelContainer extends Component {
  static propTypes = {
    amountBtc: PropTypes.number,
    fiatRates: PropTypes.object,
    settings: PropTypes.object,
    currencyType: PropTypes.oneOf([
      CURRENCY_TYPE_PRIMARY,
      CURRENCY_TYPE_SECONDARY
    ])
  };

  _renderBtcLabel() {
    return (
      <BtcLabelContainer
        {...this.props}
        amount={this.props.amountBtc}
      />
    );
  }

  _renderFiatLabel() {
    const { fiatRates, settings, currencyType } = this.props;
    const currency = settings.currency[currencyType];
    const fiatRate = fiatRates[currency];
    const amountBtc = this.props.amountBtc || 0;
    const amountFiat = fiatRate ? fiatRate * amountBtc : null;

    return (
      <FiatLabel
        {...this.props}
        amount={amountFiat}
        currency={currency}
      />
    );
  }

  render() {
    const { settings, currencyType } = this.props;
    const currency = settings.currency[currencyType];

    if (currency === CURRENCY_BTC) {
      return this._renderBtcLabel();
    }

    return this._renderFiatLabel();
  }
}

const CurrencyLabelConnector = connect(
  mapStateToProps
)(CurrencyLabelContainer);

export default CurrencyLabelConnector;
