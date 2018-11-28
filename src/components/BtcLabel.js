import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const UNIT_BTC = 'BTC';
const UNIT_MBTC = 'mBTC';
const UNIT_SATOSHIS = 'Satoshis';

const splitNumber = (number) => {
  const parts = number.split('.');
  const integer = parts[0];
  const fractional = parts[1];

  return { integer, fractional };
};

const trimTrailingZeros = (number) => {
  if (!number) {
    return '';
  }

  return number.replace(/[0]+$/, '');
};

const getUnitLabel = (unit) => {
  if (unit === UNIT_SATOSHIS) {
    return 'sats';
  }

  return unit;
};

const reverseString = (string) => {
  return string.split('').reverse().join('');
};

const addThousandsSeparators = (integer) => {
  if (!integer || integer.length < 4) {
    return integer;
  }

  const reversedInteger = reverseString(integer);
  const maskedReversedInteger = reversedInteger.match(/.{1,3}/g).join(' ');
  const maskedInteger = reverseString(maskedReversedInteger);

  return maskedInteger;
};

const formatBtc = (amount) => {
  const amountString = amount.toFixed(8);
  const number = splitNumber(amountString);

  number.fractional = trimTrailingZeros(number.fractional);

  return number;
};

const formatMBtc = (amount) => {
  const amountString = (amount * 1000).toFixed(11);
  const number = splitNumber(amountString);

  number.fractional = trimTrailingZeros(number.fractional);

  return number;
};

const formatSatoshis = (amount) => {
  let satoshis = amount * 100000000;
  let amountString;
  let suffix = '';

  if (satoshis > 1000000) {
    satoshis /= 1000000;
    suffix = 'M';
    amountString = satoshis.toFixed(6);
  } else if (satoshis > 1000) {
    satoshis /= 1000;
    suffix = 'k';
    amountString = satoshis.toFixed(3);
  } else {
    amountString = satoshis.toFixed(0);
  }

  const number = splitNumber(amountString);

  number.fractional = trimTrailingZeros(number.fractional);
  number.suffix = suffix;

  return number;
};

const formatAmount = (amount, unit, hideUnit) => {
  const unitLabel = hideUnit ? '' : getUnitLabel(unit);

  if (!amount) {
    return `0 ${unitLabel}`.trim();
  }

  let number;

  switch (unit) {
    case UNIT_BTC:
      number = formatBtc(amount);
      break;

    case UNIT_MBTC:
      number = formatMBtc(amount);
      break;

    case UNIT_SATOSHIS:
      number = formatSatoshis(amount);
      break;

    default:
      return '❓';
  }

  number.integer = addThousandsSeparators(number.integer);
  number.suffix = number.suffix || '';

  if (!number.fractional) {
    return `${number.integer}${number.suffix} ${unitLabel}`.trim();
  }

  return `${number.integer}.${number.fractional}${number.suffix} ${unitLabel}`.trim();
};

export default class BtcLabel extends Component {
  render() {
    const { amount, unit, hideUnit } = this.props;
    const label = formatAmount(amount, unit, hideUnit);

    return (
      <StyledText style={this.props.style}>
        {label}
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
