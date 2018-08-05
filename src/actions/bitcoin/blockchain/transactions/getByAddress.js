import { get as getTransactions } from './get';

export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_ADDRESS_REQUEST = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_ADDRESS_REQUEST';
export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_ADDRESS_SUCCESS = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_ADDRESS_SUCCESS';
export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_ADDRESS_FAILURE = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_ADDRESS_FAILURE';

const getByAddressRequest = () => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_ADDRESS_REQUEST
  };
};

const getByAddressSuccess = (transactions) => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_ADDRESS_SUCCESS,
    transactions
  };
};

const getByAddressFailure = (error) => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_ADDRESS_FAILURE,
    error
  };
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
 * that has at least one transaction.
 *
 * @param {object} transactions - Object mapping addresses to a list of transactions.
 */
const filterAddressesWithTransactions = (transactions) => {
  const addresses = Object.keys(transactions);

  const filteredAddresses = addresses.filter((address) => {
    return transactions[address] && transactions[address].length;
  });

  return filteredAddresses;
};

/**
 * Recursive function that gets all transactions for a list of addresses
 * by loading them from the API page by page until no more transactions
 * can by found. One page contains maximum 100 transactions per address.
 *
 * @param {function} dispatch - A redux dispatch function.
 * @param {array} addresses - Array of bitcoin addresses (strings). Maximum 20 addresses.
 * @param {number} page - Page to load. For internal use by the recursion. Starts at 1.
 * @param {object} result - An aggregation of all transactions. For internal use by the recursion.
 */
const getTransactionsForAddresses = (dispatch, addresses, page = 1, result) => {
  return dispatch(getTransactions(addresses, page)).then((transactions) => {
    const newResult = mergeResult(result, transactions);
    const nextAddresses = filterAddressesWithTransactions(transactions);
    const nextPage = page + 1;

    if (nextAddresses.length === 0) {
      return newResult;
    }

    return getTransactionsForAddresses(dispatch, nextAddresses, nextPage, newResult);
  });
};

/**
 * Action to get all transactions for a list of addresses.
 *
 * @param {array} addresses - Array of bitcoin addresses (strings). Maximum 20 addresses.
 */
export const getByAddress = (addresses) => {
  return (dispatch) => {
    dispatch(getByAddressRequest());

    return getTransactionsForAddresses(dispatch, addresses)
      .then((transactions) => {
        dispatch(getByAddressSuccess(transactions));
        return transactions;
      })
      .catch((error) => {
        dispatch(getByAddressFailure(error));
        throw error;
      });
  };
};
