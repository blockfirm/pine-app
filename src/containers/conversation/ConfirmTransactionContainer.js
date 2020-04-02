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

import { estimateFee as estimateLightningFee } from '../../actions/lightning';
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
    this._createState();
  }

  componentDidUpdate(prevProps) {
    if (this.props.contactInboundCapacity !== prevProps.contactInboundCapacity) {
      return this._createState();
    }

    if (this.props.amountBtc !== prevProps.amountBtc) {
      return this._createState();
    }

    if (this.props.contact !== prevProps.contact) {
      return this._createState();
    }

    if (this.props.forceOnChain !== prevProps.forceOnChain) {
      return this._createState();
    }
  }

  _resetState() {
    return new Promise(resolve => {
      this.setState({
        address: null,
        inputs: null,
        outputs: null,
        fee: null,
        cannotAffordFee: false,
        hasLightningCapacity: false
      }, resolve);
    });
  }

  async _createState() {
    await this._resetState();
    await this._checkLightningCapacities();

    if (this._isLightning()) {
      this._estimateLightningFee();
    } else {
      this._createTransaction();
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

    return new Promise(resolve => {
      this.setState({ hasLightningCapacity }, resolve);
    });
  }

  _isLightning() {
    const { paymentRequest, forceOnChain } = this.props;
    const { hasLightningCapacity } = this.state;

    if (forceOnChain) {
      return false;
    }

    return Boolean(paymentRequest || hasLightningCapacity);
  }

  async _estimateLightningFee() {
    const { dispatch, paymentRequest } = this.props;

    if (!paymentRequest) {
      return;
    }

    try {
      const { high } = await dispatch(estimateLightningFee(paymentRequest));
      this.setState({ fee: high });
    } catch (error) {
      dispatch(handleError(error));
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

    if (this._isLightning()) {
      return;
    }

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
    const { paymentRequest } = this.props;
    const { fee, cannotAffordFee } = this.state;

    if (this._isLightning()) {
      return (
        <ConfirmLightningTransaction
          {...this.props}
          paymentRequest={paymentRequest}
          fee={fee}
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
