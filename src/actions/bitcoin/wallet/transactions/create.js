import bitcoin from 'bitcoinjs-lib';
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

const createSuccess = (transaction, inputs, fee) => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_CREATE_SUCCESS,
    transaction,
    inputs,
    fee
  };
};

const createFailure = (error) => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_CREATE_FAILURE,
    error
  };
};

const getBitcoinNetwork = (network) => {
  return network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
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
      addresses: utxo.scriptPubKey.addresses
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
 * Creates a new unsigned transaction using bitcoinjs TransactionBuilder.
 *
 * @param {array} utxos - utxos to pick from when selecting inputs.
 * @param {number} amountBtc - Amount of the transaction in BTC.
 * @param {string} toAddress - Bitcoin address the transaction should be addressed to.
 * @param {string} changeAddress - Bitcoin address to use as change address if needed.
 * @param {number} satoshisPerByte - Satoshis to pay per byte in fees.
 * @param {string} network - 'mainnet' or 'testnet'.
 *
 * @returns { transaction, inputs, fee } where transaction is a bitcoinjs TransactionBuilder instance.
 */
/* eslint-disable-next-line max-params */
const createTransaction = (utxos, amountBtc, toAddress, changeAddress, satoshisPerByte, network) => {
  const { inputs, outputs, fee } = selectUtxos(utxos, amountBtc, toAddress, satoshisPerByte);
  const bitcoinNetwork = getBitcoinNetwork(network);
  const transaction = new bitcoin.TransactionBuilder(bitcoinNetwork);

  if (!inputs || !outputs) {
    return {};
  }

  inputs.forEach((input) => {
    transaction.addInput(input.txid, input.vout);
  });

  outputs.forEach((output) => {
    output.address = output.address || changeAddress;
    transaction.addOutput(output.address, output.value);
  });

  return { transaction, inputs, fee };
};

/**
 * Action to create a new transaction. This action doesn't build and
 * sign the created transaction.
 *
 * @param {number} amountBtc - Amount of the transaction in BTC.
 * @param {string} toAddress - Bitcoin address the transaction should be addressed to.
 *
 * @returns Promise ({ transaction, inputs, fee }) where transaction is a bitcoinjs TransactionBuilder instance.
 */
export const create = (amountBtc, toAddress) => {
  return (dispatch, getState) => {
    dispatch(createRequest());

    const state = getState();
    const utxos = state.bitcoin.wallet.utxos.items;
    const spendableUtxos = getSpendableUtxos(utxos);
    const changeAddress = state.bitcoin.wallet.addresses.internal.unused;
    const network = state.settings.bitcoin.network;

    /**
     * The user can no longer set their preferred fee level in settings.
     * Set priority to 3 blocks to try to keep fees down.
     */
    const numberOfBlocks = 3;
    const ignoreFeeLevel = true;

    // Get transaction fee estimate.
    return dispatch(getFeeEstimate(numberOfBlocks, ignoreFeeLevel))
      .then((satoshisPerByte) => {
        // Create a transaction.
        const { transaction, inputs, fee } = createTransaction(
          spendableUtxos,
          amountBtc,
          toAddress,
          changeAddress,
          satoshisPerByte,
          network
        );

        /**
         * The inputs used to construct the transaction are
         * also returned to facilitate signing them later.
         */
        dispatch(createSuccess(transaction, inputs, fee));

        return { transaction, inputs, fee };
      })
      .catch((error) => {
        dispatch(createFailure(error));
        throw error;
      });
  };
};
