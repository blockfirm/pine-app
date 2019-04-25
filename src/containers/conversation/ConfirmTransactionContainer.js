import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactNativeHaptic from 'react-native-haptic';

import {
  create as createTransaction,
  sign as signTransaction
} from '../../actions/bitcoin/wallet/transactions';

import { reserve as reserveUtxos } from '../../actions/bitcoin/wallet/utxos';
import { getAddress } from '../../actions/pine/contacts/getAddress';
import { sendPayment } from '../../actions/pine/messages/sendPayment';
import { add as addMessage } from '../../actions/messages/add';
import { handle as handleError } from '../../actions/error/handle';
import authentication from '../../authentication';
import ConfirmTransaction from '../../components/conversation/ConfirmTransaction';

const mapStateToProps = (state) => {
  return {
    userProfile: state.settings.user.profile
  };
};

class ConfirmTransactionContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    contact: PropTypes.object,
    amountBtc: PropTypes.number,
    onTransactionSent: PropTypes.func
  };

  state = {
    address: null,
    transaction: null,
    inputs: null,
    fee: null,
    cannotAffordFee: false
  }

  constructor() {
    super(...arguments);
    this._onPayPress = this._onPayPress.bind(this);
  }

  componentDidMount() {
    this._createTransaction();
  }

  componentDidUpdate(prevProps) {
    if (this.props.amountBtc !== prevProps.amountBtc) {
      this._createTransaction();
    }

    if (this.props.contact !== prevProps.contact) {
      this.setState({ address: null });
    }
  }

  _getAddress() {
    const { dispatch, contact } = this.props;

    if (this.state.address) {
      return Promise.resolve(this.state.address);
    }

    return dispatch(getAddress(contact));
  }

  _createTransaction() {
    const { dispatch, amountBtc } = this.props;

    this.setState({
      transaction: null,
      inputs: null,
      fee: null,
      cannotAffordFee: false
    });

    return this._getAddress()
      .then((address) => {
        this.setState({ address });
        return dispatch(createTransaction(amountBtc, address));
      })
      .then(({ transaction, inputs, fee }) => {
        if (fee === undefined) {
          return this.setState({ cannotAffordFee: true });
        }

        this.setState({ transaction, inputs, fee });
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _signAndPay() {
    const { dispatch, contact, amountBtc } = this.props;
    const { transaction, inputs, address } = this.state;

    return dispatch(signTransaction(transaction, inputs))
      .then(() => {
        return transaction.build().toHex();
      })
      .then((rawTransaction) => {
        return dispatch(sendPayment(rawTransaction, contact));
      })
      .then((message) => {
        // Save message to conversation.
        return dispatch(addMessage(contact.id, {
          id: message.id,
          from: null,
          amount: amountBtc * 100000000,
          txid: transaction.build().getId(),
          createdAt: message.createdAt
        }));
      })
      .then(() => {
        // Reserve UTXOs.
        const utxosToReserve = inputs.map((input) => ({
          txid: input.txid,
          index: input.vout
        }));

        return dispatch(reserveUtxos(utxosToReserve));
      })
      .then(() => {
        this.setState({
          address: null,
          transaction: null,
          inputs: null,
          fee: null,
          cannotAffordFee: false
        });

        ReactNativeHaptic.generate('notificationSuccess');
        this.props.onTransactionSent();
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _onPayPress() {
    return authentication.authenticate().then((authenticated) => {
      if (authenticated) {
        return this._signAndPay();
      }
    });
  }

  render() {
    const { transaction, inputs, fee, cannotAffordFee } = this.state;

    return (
      <ConfirmTransaction
        {...this.props}
        transaction={transaction}
        inputs={inputs}
        fee={fee}
        cannotAffordFee={cannotAffordFee}
        onPayPress={this._onPayPress}
      />
    );
  }
}

const ConfirmTransactionConnector = connect(
  mapStateToProps
)(ConfirmTransactionContainer);

export default ConfirmTransactionConnector;
