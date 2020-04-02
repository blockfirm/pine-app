/* eslint-disable max-lines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  create as createTransaction,
  sign as signTransaction
} from '../../actions/bitcoin/wallet/transactions';

import {
  sendPayment,
  sendLegacyPayment,
  sendLightningPayment,
  sendLegacyLightningPayment
} from '../../actions/messages';

import { getAddress } from '../../actions/paymentServer/contacts/getAddress';
import { handle as handleError } from '../../actions/error/handle';
import { convert, UNIT_BTC, UNIT_SATOSHIS } from '../../crypto/bitcoin/convert';
import authentication from '../../authentication';
import ConfirmTransaction from '../../components/conversation/ConfirmTransaction';
import ConfirmLightningTransaction from '../../components/conversation/ConfirmLightningTransaction';

const mapStateToProps = (state) => {
  return {
    userProfile: state.settings.user.profile,
    lightningBalance: state.lightning.balance.spendable
  };
};

class ConfirmTransactionContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    contact: PropTypes.object,
    bitcoinAddress: PropTypes.string,
    amountBtc: PropTypes.number,
    onTransactionSent: PropTypes.func,
    paymentRequest: PropTypes.string,
    forceOnChain: PropTypes.bool,
    lightningBalance: PropTypes.number,
    contactInboundCapacity: PropTypes.number
  };

  state = {
    address: null,
    inputs: null,
    outputs: null,
    fee: null,
    cannotAffordFee: false,
    hasLightningCapacity: false
  }

  constructor() {
    super(...arguments);

    this._onPayPress = this._onPayPress.bind(this);
    this._onPayLightningPress = this._onPayLightningPress.bind(this);
  }

  componentDidMount() {
    this._checkLightningCapacities();
    this._createTransaction();
  }

  componentDidUpdate(prevProps) {
    if (this.props.contactInboundCapacity !== prevProps.contactInboundCapacity) {
      this._checkLightningCapacities();
    }

    if (this.props.amountBtc !== prevProps.amountBtc) {
      this._checkLightningCapacities();
      this._createTransaction();
    }

    if (this.props.contact !== prevProps.contact) {
      this.setState({ address: null });
    }
  }

  _checkLightningCapacities() {
    const {
      amountBtc,
      lightningBalance,
      contactInboundCapacity
    } = this.props;

    const amountSats = convert(amountBtc, UNIT_BTC, UNIT_SATOSHIS);
    const hasOutboundCapacity = amountSats <= lightningBalance;
    const hasInboundCapacity = amountSats <= contactInboundCapacity;
    const hasLightningCapacity = hasOutboundCapacity && hasInboundCapacity;

    console.log('contactInboundCapacity', contactInboundCapacity);
    console.log('lightningBalance', lightningBalance);

    this.setState({ hasLightningCapacity });
  }

  _isLightning() {
    const { paymentRequest } = this.props;
    const { hasLightningCapacity } = this.state;

    return Boolean(paymentRequest || hasLightningCapacity);
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

    if (this._isLightning()) {
      return;
    }

    this.setState({
      inputs: null,
      outputs: null,
      fee: null,
      cannotAffordFee: false
    });

    return this._getAddress()
      .then((address) => {
        this.setState({ address });
        return dispatch(createTransaction(amountBtc, address));
      })
      .then(({ inputs, outputs, fee }) => {
        if (fee === undefined) {
          return this.setState({ cannotAffordFee: true });
        }

        this.setState({ inputs, outputs, fee });
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  _signAndPay() {
    const { dispatch, contact, amountBtc } = this.props;
    const { inputs, outputs, fee, address } = this.state;

    return dispatch(signTransaction(inputs, outputs))
      .then((psbt) => {
        const transaction = psbt.extractTransaction();
        const rawTransaction = transaction.toHex();

        const transactionMetadata = {
          txid: transaction.getId(),
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
          inputs: null,
          outputs: null,
          fee: null,
          cannotAffordFee: false
        });

        this.props.onTransactionSent(result || {});
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
  }

  async _sendLightningPayment() {
    const { dispatch, contact, paymentRequest, amountBtc } = this.props;
    const transactionMetadata = { amountBtc };

    try {
      let result;

      if (paymentRequest) {
        result = await dispatch(sendLegacyLightningPayment(paymentRequest, transactionMetadata, contact));
      } else {
        result = await dispatch(sendLightningPayment(transactionMetadata, contact));
      }

      this.props.onTransactionSent(result || {});
    } catch (error) {
      dispatch(handleError(error));
    }
  }

  _onPayPress() {
    return authentication.authenticate().then((authenticated) => {
      if (authenticated) {
        return this._signAndPay();
      }
    });
  }

  _onPayLightningPress() {
    return authentication.authenticate().then((authenticated) => {
      if (authenticated) {
        return this._sendLightningPayment();
      }
    });
  }

  render() {
    const { paymentRequest, forceOnChain } = this.props;
    const { fee, cannotAffordFee } = this.state;

    if (!forceOnChain && this._isLightning()) {
      return (
        <ConfirmLightningTransaction
          {...this.props}
          paymentRequest={paymentRequest}
          onPayPress={this._onPayLightningPress}
        />
      );
    }

    return (
      <ConfirmTransaction
        {...this.props}
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
