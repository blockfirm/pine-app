import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getRegionLocale, DECIMAL_SEPARATOR } from '../localization';
import StyledText from './StyledText';

const formatAmount = (amount, currency) => {
  if (amount === null) {
    return `- ${currency}`;
  }

  const formatOptions = {
    style: 'currency',
    currencyDisplay: 'code',
    currency
  };

  let formattedAmount = new Intl.NumberFormat(getRegionLocale(), formatOptions).format(amount);

  // Remove the currency code - it will be added at the end (some locales will add it as a prefix).
  formattedAmount = formattedAmount.replace(currency, '').trim();

  // Remove decimals when they're all zeros, e.g. '.00'.
  formattedAmount = formattedAmount.replace(new RegExp(`\\${DECIMAL_SEPARATOR}[0]+$`), '');

  return `${formattedAmount} ${currency}`;
};

export default class FiatLabel extends Component {
  render() {
    const { amount, currency } = this.props;
    const label = formatAmount(amount, currency);

    return (
      <StyledText style={this.props.style}>
        {label}
      </StyledText>
    );
  }
}

FiatLabel.propTypes = {
  style: PropTypes.any,
  amount: PropTypes.number,
  currency: PropTypes.string.isRequired
};
