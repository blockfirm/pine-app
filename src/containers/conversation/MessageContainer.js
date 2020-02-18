import React, { PureComponent } from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Message from '../../components/conversation/Message';

const mapStateToProps = (state) => ({
  transactions: state.bitcoin.wallet.transactions.items,
  invoicesByMessageId: state.lightning.invoices.itemsByMessageId,
  bitcoinNetwork: state.settings.bitcoin.network
});

class MessageContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.any,
    message: PropTypes.object,
    transactions: PropTypes.array,
    invoicesByMessageId: PropTypes.object.isRequired,
    bitcoinNetwork: PropTypes.oneOf(['mainnet', 'testnet'])
  };

  constructor() {
    super(...arguments);
    this._onPress = this._onPress.bind(this);
  }

  _findTransaction() {
    const { message, transactions } = this.props;

    if (message.error) {
      return;
    }

    return transactions.find((transaction) => {
      return transaction.txid === message.txid;
    });
  }

  _findInvoice() {
    const { message, invoicesByMessageId } = this.props;

    if (message.type === 'lightning_payment') {
      return invoicesByMessageId[message.id];
    }
  }

  _onPress() {
    const { navigation, message, bitcoinNetwork } = this.props;
    const transaction = this._findTransaction();

    navigation.navigate('PaymentDetails', {
      transaction,
      message,
      bitcoinNetwork
    });
  }

  render() {
    const transaction = this._findTransaction();
    const invoice = this._findInvoice();

    return (
      <Message
        {...this.props}
        transaction={transaction}
        invoice={invoice}
        onPress={this._onPress}
      />
    );
  }
}

const MessageConnector = connect(mapStateToProps)(MessageContainer);

export default withNavigation(MessageConnector);
