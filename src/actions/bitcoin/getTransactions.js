import * as api from '../../api';

export const BITCOIN_GET_TRANSACTIONS_REQUEST = 'BITCOIN_GET_TRANSACTIONS_REQUEST';
export const BITCOIN_GET_TRANSACTIONS_SUCCESS = 'BITCOIN_GET_TRANSACTIONS_SUCCESS';
export const BITCOIN_GET_TRANSACTIONS_FAILURE = 'BITCOIN_GET_TRANSACTIONS_FAILURE';

const getTransactionsRequest = () => {
  return {
    type: BITCOIN_GET_TRANSACTIONS_REQUEST
  };
};

const getTransactionsSuccess = (transactions) => {
  return {
    type: BITCOIN_GET_TRANSACTIONS_SUCCESS,
    transactions
  };
};

const getTransactionsFailure = (error) => {
  return {
    type: BITCOIN_GET_TRANSACTIONS_FAILURE,
    error
  };
};

export const getTransactions = (addresses, page) => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(getTransactionsRequest());

    return api.bitcoin.transactions.get(addresses, page, options)
      .then((transactions) => {
        dispatch(getTransactionsSuccess(transactions));
      })
      .catch((error) => {
        dispatch(getTransactionsFailure(error));
        throw error;
      });
  };
};
