import * as api from '../../../../api';

export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_REQUEST = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_REQUEST';
export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_SUCCESS = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_SUCCESS';
export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_FAILURE = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_FAILURE';

const getRequest = () => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_REQUEST
  };
};

const getSuccess = (transactions) => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_SUCCESS,
    transactions
  };
};

const getFailure = (error) => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_FAILURE,
    error
  };
};

/**
 * Action to get one page of transactions for a list of addresses.
 * Each page contains maximum 100 transactions per address. Returns
 * a map of addresses to transactions.
 *
 * @param {array} addresses - Array of bitcoin addresses (strings). Maximum 20 addresses.
 * @param {number} page - Page to load. Starts at 1.
 */
export const get = (addresses, page) => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(getRequest());

    return api.bitcoin.transactions.get(addresses, page, options)
      .then((transactions) => {
        dispatch(getSuccess(transactions));
        return transactions;
      })
      .catch((error) => {
        dispatch(getFailure(error));
        throw error;
      });
  };
};
