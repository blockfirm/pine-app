import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { formatCurrency } from '../localization';
import StyledText from './StyledText';

export default class FiatLabel extends Component {
  render() {
    const { amount, currency } = this.props;
    const label = formatCurrency(amount, currency);

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
