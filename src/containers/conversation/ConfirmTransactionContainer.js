import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  create as createTransaction,
  sign as signTransaction
} from '../../actions/bitcoin/wallet/transactions';

import { getAddress } from '../../actions/pine/contacts/getAddress';
import { sendPayment, sendLegacyPayment } from '../../actions/messages';
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
    bitcoinAddress: PropTypes.string,
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
    const { dispatch, contact, bitcoinAddress } = this.props;

    if (bitcoinAddress) {
      return Promise.resolve(bitcoinAddress);
    }

    if (contact.isBitcoinAddress) {
      return Promise.resolve(contact.address);
    }

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
    const { transaction, inputs, fee, address } = this.state;

    return dispatch(signTransaction(transaction, inputs))
      .then(() => {
        const builtTransaction = transaction.build();
        const rawTransaction = builtTransaction.toHex();

        const transactionMetadata = {
          txid: builtTransaction.getId(),
          address,
          amountBtc,
          fee,
          inputs
        };

        if (!contact || contact.isBitcoinAddress) {
          return dispatch(sendLegacyPayment(rawTransaction, transactionMetadata, contact));
        }

        return dispatch(sendPayment(rawTransaction, transactionMetadata, contact));
      })
      .then((result) => {
        this.setState({
          address: null,
          transaction: null,
          inputs: null,
          fee: null,
          cannotAffordFee: false
        });

        this.props.onTransactionSent(result || {});
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
