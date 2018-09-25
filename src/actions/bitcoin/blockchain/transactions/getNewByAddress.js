import { get as getTransactions } from './get';

export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_REQUEST = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_REQUEST';
export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_SUCCESS = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_SUCCESS';
export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_FAILURE = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_FAILURE';

const PAGE_SIZE = 5;

const getNewByAddressRequest = () => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_REQUEST
  };
};

const getNewByAddressSuccess = (transactions) => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_SUCCESS,
    transactions
  };
};

const getNewByAddressFailure = (error) => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_NEW_BY_ADDRESS_FAILURE,
    error
  };
};

/**
 * Removes old transactions from the transactions object.
 *
 * @param {object} transactions - Object with transactions grouped by address.
 * @param {object} txidMap - Object with old transaction ids as keys.
 */
const removeOldTransactions = (transactions, txidMap) => {
  const keys = Object.keys(transactions);

  keys.forEach((key) => {
    transactions[key] = transactions[key].filter((transaction) => {
      return !txidMap[transaction.txid];
    });
  });
};

/**
 * Merges two maps of addresses/transactions with each other.
 *
 * @param {object} prevResult - Previous result.
 * @param {object} newResult - New result to merge with previous result.
 */
const mergeResult = (prevResult, newResult) => {
  if (!prevResult) {
    return newResult;
  }

  const merged = { ...prevResult };
  const keys = Object.keys(merged);

  keys.forEach((key) => {
    if (newResult[key]) {
      merged[key] = [...prevResult[key], ...newResult[key]];
    }
  });

  return merged;
};

/**
 * Filters a set of addresses/transactions and returns a list of addresses
 * that has full pages of transactions.
 *
 * @param {object} transactions - Object mapping addresses to a list of transactions.
 */
const filterAddressesWithFullPages = (transactions) => {
  const addresses = Object.keys(transactions);

  const filteredAddresses = addresses.filter((address) => {
    return transactions[address] && transactions[address].length === PAGE_SIZE;
  });

  return filteredAddresses;
};

/**
 * Recursive function that gets all new transactions for a list of addresses
 * by loading them from the API page by page until no more new transactions
 * can by found. One page contains maximum 5 transactions per address.
 *
 * @param {function} dispatch - A redux dispatch function.
 * @param {array} addresses - Array of bitcoin addresses (strings). Maximum 20 addresses.
 * @param {object} txidMap - Object with old transaction ids as keys.
 * @param {number} page - Page to load. For internal use by the recursion. Starts at 1.
 * @param {object} result - An aggregation of all transactions. For internal use by the recursion.
 */
// eslint-disable-next-line max-params
const getNewTransactionsForAddresses = (dispatch, addresses, txidMap, page = 1, result) => {
  const reverse = true;

  return dispatch(getTransactions(addresses, page, PAGE_SIZE, reverse))
    .then((transactions) => {
      removeOldTransactions(transactions, txidMap);
      return transactions;
    })
    .then((transactions) => {
      const newResult = mergeResult(result, transactions);
      const nextAddresses = filterAddressesWithFullPages(transactions);
      const nextPage = page + 1;

      if (nextAddresses.length === 0) {
        return newResult;
      }

      return getNewTransactionsForAddresses(dispatch, nextAddresses, txidMap, nextPage, newResult);
    });
};

/**
 * Creates an object with all txids from transactions as keys.
 *
 * @param {array} transactions - List of transactions.
 */
const getTxidMap = (transactions) => {
  const txidMap = transactions.reduce((map, transaction) => {
    map[transaction.txid] = true;
    return map;
  }, {});

  return txidMap;
};

/**
 * Action to get new transactions for a list of addresses.
 *
 * @param {array} addresses - Array of bitcoin addresses (strings). Maximum 20 addresses.
 * @param {array} oldTransactions - Array of all bitcoin transactions in the wallet.
 */
export const getNewByAddress = (addresses, oldTransactions) => {
  return (dispatch) => {
    dispatch(getNewByAddressRequest());

    const txidMap = getTxidMap(oldTransactions);

    return getNewTransactionsForAddresses(dispatch, addresses, txidMap)
      .then((transactions) => {
        dispatch(getNewByAddressSuccess(transactions));
        return transactions;
      })
      .catch((error) => {
        dispatch(getNewByAddressFailure(error));
        throw error;
      });
  };
};
