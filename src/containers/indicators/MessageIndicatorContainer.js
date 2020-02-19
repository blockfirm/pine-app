import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MessageIndicator from '../../components/indicators/MessageIndicator';

const mapStateToProps = (state) => {
  return {
    transactions: state.bitcoin.wallet.transactions.items,
    invoicesByMessageId: state.lightning.invoices.itemsByMessageId
  };
};

class MessageIndicatorContainer extends PureComponent {
  static propTypes = {
    message: PropTypes.object,
    transactions: PropTypes.array,
    invoicesByMessageId: PropTypes.object.isRequired
  };

  _findTransaction() {
    const { message, transactions } = this.props;

    if (!message || message.error) {
      return;
    }

    return transactions.find((transaction) => {
      return transaction.txid === message.txid;
    });
  }

  _findInvoice() {
    const { message, invoicesByMessageId } = this.props;

    if (message && message.type === 'lightning_payment') {
      return invoicesByMessageId[message.id];
    }
  }

  render() {
    const transaction = this._findTransaction();
    const invoice = this._findInvoice();

    return (
      <MessageIndicator
        {...this.props}
        transaction={transaction}
        invoice={invoice}
      />
    );
  }
}

const MessageIndicatorConnector = connect(
  mapStateToProps
)(MessageIndicatorContainer);

export default MessageIndicatorConnector;
