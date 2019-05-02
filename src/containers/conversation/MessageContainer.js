import React, { PureComponent } from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Message from '../../components/conversation/Message';

const mapStateToProps = (state) => {
  return {
    transactions: state.bitcoin.wallet.transactions.items,
    bitcoinNetwork: state.settings.bitcoin.network
  };
};

class MessageContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.any,
    message: PropTypes.object,
    transactions: PropTypes.array,
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

    return (
      <Message
        {...this.props}
        transaction={transaction}
        onPress={this._onPress}
      />
    );
  }
}

const MessageConnector = connect(mapStateToProps)(MessageContainer);

export default withNavigation(MessageConnector);
