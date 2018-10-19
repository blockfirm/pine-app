import { getNewByAddress as getNewTransactionsByAddress } from '../blockchain/transactions/getNewByAddress';
import { update as updateUtxos } from './utxos';
import { save as saveExternalAddresses } from './addresses/external';
import { save as saveInternalAddresses } from './addresses/internal';
import { flagAsUsed } from './addresses/flagAsUsed';

import {
  add as addTransactions,
  updatePending as updatePendingTransactions
} from './transactions';

export const BITCOIN_WALLET_SYNC_REQUEST = 'BITCOIN_WALLET_SYNC_REQUEST';
export const BITCOIN_WALLET_SYNC_SUCCESS = 'BITCOIN_WALLET_SYNC_SUCCESS';
export const BITCOIN_WALLET_SYNC_FAILURE = 'BITCOIN_WALLET_SYNC_FAILURE';

const syncRequest = () => {
  return {
    type: BITCOIN_WALLET_SYNC_REQUEST
  };
};

const syncSuccess = () => {
  return {
    type: BITCOIN_WALLET_SYNC_SUCCESS
  };
};

const syncFailure = (error) => {
  return {
    type: BITCOIN_WALLET_SYNC_FAILURE,
    error
  };
};

/**
 * Flags addresses found in the transaction list as being used.
 */
const flagAddressesAsUsed = (dispatch, addressTransactions) => {
  const addresses = Object.keys(addressTransactions);
  const usedAddresses = addresses.filter((address) => addressTransactions[address].length > 0);

  dispatch(flagAsUsed(usedAddresses));
};

const concatTransactions = (addressTransactions) => {
  return Object.values(addressTransactions).reduce((accumulator, transactions) => {
    return accumulator.concat(transactions);
  }, []);
};

/**
 * Gets new transactions for a list of maximum 20 addresses and saves them to the state
 * and persistent storage.
 *
 * @param {function} dispatch - A redux dispatch function.
 * @param {array} addresses - List of addresses (strings) to get new transactions for. Max 20.
 * @param {array} oldTransactions - List of old transactions. Used to identify old transactions.
 */
const getNewTransactionsForBatch = (dispatch, addresses, oldTransactions) => {
  return dispatch(getNewTransactionsByAddress(addresses, oldTransactions))
    .then((transactions) => {
      // Flag addresses with transactions as used.
      flagAddressesAsUsed(dispatch, transactions);
      return transactions;
    })
    .then((transactions) => {
      // Concat all transactions from all addresses.
      return concatTransactions(transactions);
    })
    .then((transactions) => {
      // Save transactions.
      return dispatch(addTransactions(transactions));
    });
};

/**
 * Gets new transactions for a list of addresses and saves them to the state
 * and persistent storage.
 *
 * @param {function} dispatch - A redux dispatch function.
 * @param {array} addresses - List of addresses (strings) to get new transactions for.
 * @param {array} oldTransactions - List of old transactions. Used to identify old transactions.
 */
const getNewTransactions = (dispatch, addresses, oldTransactions) => {
  const chunkSize = 20;
  const chunks = [];

  // Split the addresses array into chunks of 20.
  for (let i = 0; i < addresses.length; i += chunkSize) {
    chunks.push(addresses.slice(i, i + chunkSize));
  }

  // Get new transactions for each chunk of addresses.
  const promises = chunks.map((chunk) => {
    return getNewTransactionsForBatch(dispatch, chunk, oldTransactions);
  });

  return Promise.all(promises);
};

const getAllNewTransactions = (dispatch, getState) => {
  const state = getState();
  const externalAddresses = Object.keys(state.bitcoin.wallet.addresses.external.items);
  const internalAddresses = Object.keys(state.bitcoin.wallet.addresses.internal.items);
  const transactions = state.bitcoin.wallet.transactions.items;

  const promises = [
    getNewTransactions(dispatch, externalAddresses, transactions),
    getNewTransactions(dispatch, internalAddresses, transactions)
  ];

  return Promise.all(promises);
};

/**
 * Action to sync the wallet by loading new transactions from
 * the bitcoin blockchain and updating pending ones.
 */
export const sync = () => {
  return (dispatch, getState) => {
    dispatch(syncRequest());

    // First update pending transactions.
    return dispatch(updatePendingTransactions())
      .then(() => {
        // Then get new transactions.
        return getAllNewTransactions(dispatch, getState);
      })
      .then(() => {
        // Save addresses that has been flagged as used.
        const savePromises = [
          dispatch(saveExternalAddresses()),
          dispatch(saveInternalAddresses())
        ];

        return Promise.all(savePromises);
      })
      .then(() => {
        // And last, update the utxo set.
        return dispatch(updateUtxos());
      })
      .then(() => {
        dispatch(syncSuccess());
      })
      .catch((error) => {
        dispatch(syncFailure(error));
        throw error;
      });
  };
};
