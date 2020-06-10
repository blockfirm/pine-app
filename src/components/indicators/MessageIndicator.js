import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ErrorIndicator from './ErrorIndicator';
import ReceivedIndicator from './ReceivedIndicator';
import ReceivedLightningIndicator from './ReceivedLightningIndicator';
import SentIndicator from './SentIndicator';
import SentLightningIndicator from './SentLightningIndicator';
import CanceledIndicator from './CanceledIndicator';

const COLOR_STYLE_COLOR = 'color';
const COLOR_STYLE_LIGHT = 'light';

const TYPE_LIGHTNING_PAYMENT = 'lightning_payment';
const TYPE_LEGACY_LIGHTNING_PAYMENT = 'legacy_lightning_payment';

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

  _getInvoiceStatus() {
    const { invoice } = this.props;

    if (invoice.redeemed) {
      return 2;
    }

    if (invoice.payee) {
      return invoice.paymentHash ? 1 : 0;
    }

    return 1;
  }

  _getStatus() {
    const { message, transaction, invoice } = this.props;

    if (invoice) {
      return this._getInvoiceStatus();
    }

    if (transaction) {
      return this._getTransactionStatus();
    }

    if (message && message.type === TYPE_LEGACY_LIGHTNING_PAYMENT) {
      return 2;
    }

    return 0;
  }

  _isLightning() {
    const { message } = this.props;
    return [TYPE_LIGHTNING_PAYMENT, TYPE_LEGACY_LIGHTNING_PAYMENT].includes(message.type);
  }

  _renderReceivedIndicator() {
    const { style, colorStyle } = this.props;
    const status = this._getStatus();

    if (this._isLightning()) {
      return <ReceivedLightningIndicator status={status} style={style} colorStyle={colorStyle} />;
    }

    return <ReceivedIndicator status={status} style={style} colorStyle={colorStyle} />;
  }

  _renderSentIndicator() {
    const { style, colorStyle } = this.props;
    const status = this._getStatus();

    if (this._isLightning()) {
      return <SentLightningIndicator status={status} style={style} colorStyle={colorStyle} />;
    }

    return <SentIndicator status={status} style={style} colorStyle={colorStyle} />;
  }

  render() {
    const { message, transaction, invoice, style, colorStyle } = this.props;

    if (!message) {
      return null;
    }

    if (message.error || (invoice && invoice.redeemError)) {
      return <ErrorIndicator style={style} colorStyle={colorStyle} />;
    }

    if (message.canceled && !transaction) {
      return <CanceledIndicator style={style} colorStyle={colorStyle} />;
    }

    if (message.from) {
      return this._renderReceivedIndicator();
    }

    return this._renderSentIndicator();
  }
}

MessageIndicator.propTypes = {
  style: PropTypes.any,
  colorStyle: PropTypes.oneOf([COLOR_STYLE_COLOR, COLOR_STYLE_LIGHT]),
  message: PropTypes.object,
  transaction: PropTypes.object,
  invoice: PropTypes.object
};

MessageIndicator.defaultProps = {
  colorStyle: COLOR_STYLE_COLOR
};
