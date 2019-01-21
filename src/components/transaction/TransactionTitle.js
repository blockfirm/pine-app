import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import getTransactionAmount from '../../crypto/bitcoin/getTransactionAmount';
import CurrencyLabelContainer from '../../containers/CurrencyLabelContainer';
import StyledText from '../StyledText';

export default class TransactionTitle extends Component {
  _getAmount() {
    const { transaction, externalAddresses, internalAddresses } = this.props;
    return getTransactionAmount(transaction, externalAddresses, internalAddresses);
  }

  _getTitle(amount) {
    const { transaction } = this.props;
    const confirmations = transaction.confirmations;

    if (confirmations) {
      return amount < 0 ? 'Sent' : 'Received';
    }

    return amount < 0 ? 'Sending' : 'Receiving';
  }

  _renderAmount(amount) {
    if (!this.props.showAmount) {
      return null;
    }

    return (
      <CurrencyLabelContainer
        amountBtc={Math.abs(amount)}
        currencyType='primary'
        style={this.props.style}
      />
    );
  }

  render() {
    const amount = this._getAmount();
    const title = this._getTitle(amount);

    return (
      <StyledText style={this.props.style} numberOfLines={1}>
        <Text>{title} </Text>
        {this._renderAmount(amount)}
      </StyledText>
    );
  }
}

TransactionTitle.propTypes = {
  transaction: PropTypes.object.isRequired,
  externalAddresses: PropTypes.object,
  internalAddresses: PropTypes.object,
  showAmount: PropTypes.bool,
  style: PropTypes.any
};
