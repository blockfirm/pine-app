import * as api from '../../../../api';

export const BITCOIN_API_TRANSACTIONS_GET_REQUEST = 'BITCOIN_API_TRANSACTIONS_GET_REQUEST';
export const BITCOIN_API_TRANSACTIONS_GET_SUCCESS = 'BITCOIN_API_TRANSACTIONS_GET_SUCCESS';
export const BITCOIN_API_TRANSACTIONS_GET_FAILURE = 'BITCOIN_API_TRANSACTIONS_GET_FAILURE';

const getRequest = () => {
  return {
    type: BITCOIN_API_TRANSACTIONS_GET_REQUEST
  };
};

const getSuccess = (transactions) => {
  return {
    type: BITCOIN_API_TRANSACTIONS_GET_SUCCESS,
    transactions
  };
};

const getFailure = (error) => {
  return {
    type: BITCOIN_API_TRANSACTIONS_GET_FAILURE,
    error
  };
};

export const get = (addresses, page) => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(getRequest());

    return api.bitcoin.transactions.get(addresses, page, options)
      .then((transactions) => {
        dispatch(getSuccess(transactions));
      })
      .catch((error) => {
        dispatch(getFailure(error));
        throw error;
      });
  };
};
