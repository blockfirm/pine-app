import coinSelect from 'coinselect';

import {
  UNIT_BTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin
} from '../../../../crypto/bitcoin/convert';

import { getEstimate as getFeeEstimate } from '../../fees';

export const BITCOIN_WALLET_TRANSACTIONS_CREATE_REQUEST = 'BITCOIN_WALLET_TRANSACTIONS_CREATE_REQUEST';
export const BITCOIN_WALLET_TRANSACTIONS_CREATE_SUCCESS = 'BITCOIN_WALLET_TRANSACTIONS_CREATE_SUCCESS';
export const BITCOIN_WALLET_TRANSACTIONS_CREATE_FAILURE = 'BITCOIN_WALLET_TRANSACTIONS_CREATE_FAILURE';

const createRequest = () => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_CREATE_REQUEST
  };
};

const createSuccess = (inputs, outputs, fee) => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_CREATE_SUCCESS,
    inputs,
    outputs,
    fee
  };
};

const createFailure = (error) => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_CREATE_FAILURE,
    error
  };
};

const getSpendableUtxos = (utxos) => {
  /**
   * Spendable UTXOs include all confirmed UTXOs
   * and all unconfirmed internal (change) UTXOs
   * that has not been reserved.
   */
  return utxos.filter((utxo) => {
    return (utxo.confirmed || utxo.internal) && !utxo.reserved;
  });
};

/**
 * Transforms the utxo set into a structure understood by the coinselect algorithm.
 */
const transformUtxos = (utxos) => {
  return utxos.map((utxo) => {
    const satoshis = convertBitcoin(utxo.value, UNIT_BTC, UNIT_SATOSHIS);

    return {
      txid: utxo.txid,
      vout: utxo.n,
      value: satoshis,
      addresses: utxo.scriptPubKey.addresses || []
    };
  });
};

/**
 * Selects a set of utxos to be used as inputs to a transaction based on the specified amount.
 * Returns an object containing the created inputs, outputs (for change), and the fee.
 */
const selectUtxos = (utxos, amountBtc, toAddress, satoshisPerByte) => {
  const satoshis = convertBitcoin(amountBtc, UNIT_BTC, UNIT_SATOSHIS);
  const transformedUtxos = transformUtxos(utxos);

  const targets = [{
    address: toAddress,
    value: satoshis
  }];

  return coinSelect(transformedUtxos, targets, satoshisPerByte);
};

/**
 * Creates a new unsigned transaction.
 *
 * @param {array} utxos - utxos to pick from when selecting inputs.
 * @param {number} amountBtc - Amount of the transaction in BTC.
 * @param {string} toAddress - Bitcoin address the transaction should be addressed to.
 * @param {string} changeAddress - Bitcoin address to use as change address if needed.
 * @param {number} satoshisPerByte - Satoshis to pay per byte in fees.
 *
 * @returns { inputs, outputs, fee }
 */
/* eslint-disable-next-line max-params */
const createTransaction = (utxos, amountBtc, toAddress, changeAddress, satoshisPerByte) => {
  const { inputs, outputs, fee } = selectUtxos(utxos, amountBtc, toAddress, satoshisPerByte);

  if (!inputs || !outputs) {
    return {};
  }

  outputs.forEach((output) => {
    output.address = output.address || changeAddress;
  });

  return { inputs, outputs, fee };
};

/**
 * Action to create a new transaction. This action doesn't build and
 * sign the created transaction.
 *
 * @param {number} amountBtc - Amount of the transaction in BTC.
 * @param {string} toAddress - Bitcoin address the transaction should be addressed to.
 *
 * @returns {Promise.{ inputs, outputs, fee }}
 */
export const create = (amountBtc, toAddress) => {
  return (dispatch, getState) => {
    dispatch(createRequest());

    const state = getState();
    const utxos = state.bitcoin.wallet.utxos.items;
    const spendableUtxos = getSpendableUtxos(utxos);
    const changeAddress = state.bitcoin.wallet.addresses.internal.unused;
    const { numberOfBlocks } = state.settings.bitcoin.fee;

    // The user can no longer set their preferred fee level.
    const ignoreFeeLevel = true;

    // Get transaction fee estimate.
    return dispatch(getFeeEstimate(numberOfBlocks, ignoreFeeLevel))
      .then((satoshisPerByte) => {
        const { inputs, outputs, fee } = createTransaction(
          spendableUtxos,
          amountBtc,
          toAddress,
          changeAddress,
          satoshisPerByte
        );

        dispatch(createSuccess(inputs, outputs, fee));
        return { inputs, outputs, fee };
      })
      .catch((error) => {
        dispatch(createFailure(error));
        throw error;
      });
  };
};
