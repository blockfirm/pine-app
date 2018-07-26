import * as api from '../../../../api';

export const BITCOIN_API_TRANSACTIONS_POST_REQUEST = 'BITCOIN_API_TRANSACTIONS_POST_REQUEST';
export const BITCOIN_API_TRANSACTIONS_POST_SUCCESS = 'BITCOIN_API_TRANSACTIONS_POST_SUCCESS';
export const BITCOIN_API_TRANSACTIONS_POST_FAILURE = 'BITCOIN_API_TRANSACTIONS_POST_FAILURE';

const postRequest = () => {
  return {
    type: BITCOIN_API_TRANSACTIONS_POST_REQUEST
  };
};

const postSuccess = (transaction) => {
  return {
    type: BITCOIN_API_TRANSACTIONS_POST_SUCCESS,
    transaction
  };
};

const postFailure = (error) => {
  return {
    type: BITCOIN_API_TRANSACTIONS_POST_FAILURE,
    error
  };
};

export const post = (transaction) => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(postRequest());

    return api.bitcoin.transactions.post(transaction, options)
      .then(() => {
        dispatch(postSuccess(transaction));
      })
      .catch((error) => {
        dispatch(postFailure(error));
        throw error;
      });
  };
};
