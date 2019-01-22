import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formatNumber from '../localization/formatNumber';
import StyledText from './StyledText';

const UNIT_BTC = 'BTC';
const UNIT_MBTC = 'mBTC';
const UNIT_SATOSHIS = 'Satoshis';

const getUnitLabel = (unit) => {
  if (unit === UNIT_SATOSHIS) {
    return 'sats';
  }

  return unit;
};

const formatBtc = (amount) => {
  return amount.toFixed(8);
};

const formatMBtc = (amount) => {
  return (amount * 1000).toFixed(5);
};

const formatSatoshis = (amount) => {
  return (amount * 100000000).toFixed(0);
};

const formatAmount = (amount, unit, hideUnit) => {
  const unitLabel = hideUnit ? '' : getUnitLabel(unit);

  if (!amount) {
    return `0 ${unitLabel}`.trim();
  }

  let amountString;

  switch (unit) {
    case UNIT_BTC:
      amountString = formatBtc(amount);
      break;

    case UNIT_MBTC:
      amountString = formatMBtc(amount);
      break;

    case UNIT_SATOSHIS:
      amountString = formatSatoshis(amount);
      break;

    default:
      return '❓';
  }

  amountString = formatNumber(amountString);

  return `${amountString} ${unitLabel}`.trim();
};

export default class BtcLabel extends Component {
  render() {
    const { amount, unit, hideUnit } = this.props;
    const absoluteAmount = Math.abs(amount);
    const label = formatAmount(absoluteAmount, unit, hideUnit);

    return (
      <StyledText style={this.props.style}>
        { amount < 0 ? '-' : null }{label}
      </StyledText>
    );
  }
}

BtcLabel.propTypes = {
  style: PropTypes.any,
  amount: PropTypes.number.isRequired,
  unit: PropTypes.string,
  hideUnit: PropTypes.bool
};
