import React, { Component } from 'react';
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

class MessageContainer extends Component {
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

  _onPress() {
    const { navigation, message, transactions, bitcoinNetwork } = this.props;

    if (message.error) {
      return;
    }

    const messageTransaction = transactions.find((transaction) => {
      return transaction.txid === message.txid;
    });

    navigation.navigate('PaymentDetails', {
      transaction: messageTransaction,
      message,
      bitcoinNetwork
    });
  }

  render() {
    return (
      <Message
        {...this.props}
        onPress={this._onPress}
      />
    );
  }
}

const MessageConnector = connect(mapStateToProps)(MessageContainer);

export default withNavigation(MessageConnector);
