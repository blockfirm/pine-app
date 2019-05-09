import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MessageIndicator from '../../components/indicators/MessageIndicator';

const mapStateToProps = (state) => {
  return {
    transactions: state.bitcoin.wallet.transactions.items
  };
};

class MessageIndicatorContainer extends PureComponent {
  static propTypes = {
    message: PropTypes.object,
    transactions: PropTypes.array
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

  render() {
    const transaction = this._findTransaction();

    return (
      <MessageIndicator
        {...this.props}
        transaction={transaction}
      />
    );
  }
}

const MessageIndicatorConnector = connect(
  mapStateToProps
)(MessageIndicatorContainer);

export default MessageIndicatorConnector;
