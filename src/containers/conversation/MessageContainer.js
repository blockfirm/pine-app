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

  state = {
    transaction: null
  }

  constructor() {
    super(...arguments);
    this._onPress = this._onPress.bind(this);
  }

  componentDidMount() {
    const { message, transactions } = this.props;

    if (!message.error) {
      const messageTransaction = transactions.find((transaction) => {
        return transaction.txid === message.txid;
      });

      this.setState({
        transaction: messageTransaction
      });
    }
  }

  _onPress() {
    const { navigation, message, bitcoinNetwork } = this.props;
    const { transaction } = this.state;

    navigation.navigate('PaymentDetails', {
      transaction,
      message,
      bitcoinNetwork
    });
  }

  render() {
    return (
      <Message
        {...this.props}
        transaction={this.state.transaction}
        onPress={this._onPress}
      />
    );
  }
}

const MessageConnector = connect(mapStateToProps)(MessageContainer);

export default withNavigation(MessageConnector);
