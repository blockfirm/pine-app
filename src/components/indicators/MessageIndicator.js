import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ErrorIndicator from './ErrorIndicator';
import ReceivedIndicator from './ReceivedIndicator';
import SentIndicator from './SentIndicator';

export default class MessageIndicator extends Component {
  _getTransactionStatus() {
    const { transaction } = this.props;

    if (!transaction) {
      return 0;
    }

    if (!transaction.confirmations) {
      return 1;
    }

    return 2;
  }

  render() {
    const { message, style } = this.props;
    const transactionStatus = this._getTransactionStatus();

    if (!message) {
      return null;
    }

    if (message.error) {
      return <ErrorIndicator style={style} />;
    }

    if (message.from) {
      return <ReceivedIndicator status={transactionStatus} style={style} />;
    }

    return <SentIndicator status={transactionStatus} style={style} />;
  }
}

MessageIndicator.propTypes = {
  style: PropTypes.any,
  message: PropTypes.object,
  transaction: PropTypes.object
};
