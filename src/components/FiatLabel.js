import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const formatAmount = (amount, currency) => {
  if (amount === null) {
    return `- ${currency}`;
  }

  if (!amount) {
    return `0 ${currency}`;
  }

  const formatOptions = {
    style: 'currency',
    currencyDisplay: 'code',
    currency
  };

  let formattedAmount = new Intl.NumberFormat('en-US', formatOptions).format(amount);

  formattedAmount = formattedAmount.replace(currency, '');
  formattedAmount = formattedAmount.replace(',', ' ');
  formattedAmount = formattedAmount.replace('.00', '');

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
