import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ErrorIndicator from './ErrorIndicator';
import ReceivedIndicator from './ReceivedIndicator';
import SentIndicator from './SentIndicator';

const COLOR_STYLE_COLOR = 'color';
const COLOR_STYLE_LIGHT = 'light';

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
    const { message, style, colorStyle } = this.props;
    const transactionStatus = this._getTransactionStatus();

    if (!message) {
      return null;
    }

    if (message.error) {
      return <ErrorIndicator style={style} colorStyle={colorStyle} />;
    }

    if (message.from) {
      return <ReceivedIndicator status={transactionStatus} style={style} colorStyle={colorStyle} />;
    }

    return <SentIndicator status={transactionStatus} style={style} colorStyle={colorStyle} />;
  }
}

MessageIndicator.propTypes = {
  style: PropTypes.any,
  colorStyle: PropTypes.oneOf([COLOR_STYLE_COLOR, COLOR_STYLE_LIGHT]),
  message: PropTypes.object,
  transaction: PropTypes.object
};

MessageIndicator.defaultProps = {
  colorStyle: COLOR_STYLE_COLOR
};
