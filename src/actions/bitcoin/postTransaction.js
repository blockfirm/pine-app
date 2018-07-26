import * as api from '../../api';

export const BITCOIN_POST_TRANSACTION_REQUEST = 'BITCOIN_POST_TRANSACTION_REQUEST';
export const BITCOIN_POST_TRANSACTION_SUCCESS = 'BITCOIN_POST_TRANSACTION_SUCCESS';
export const BITCOIN_POST_TRANSACTION_FAILURE = 'BITCOIN_POST_TRANSACTION_FAILURE';

const postTransactionRequest = () => {
  return {
    type: BITCOIN_POST_TRANSACTION_REQUEST
  };
};

const postTransactionSuccess = (transaction) => {
  return {
    type: BITCOIN_POST_TRANSACTION_SUCCESS,
    transaction
  };
};

const postTransactionFailure = (error) => {
  return {
    type: BITCOIN_POST_TRANSACTION_FAILURE,
    error
  };
};

export const postTransaction = (transaction) => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(postTransactionRequest());

    return api.bitcoin.transactions.post(transaction, options)
      .then(() => {
        dispatch(postTransactionSuccess(transaction));
      })
      .catch((error) => {
        dispatch(postTransactionFailure(error));
        throw error;
      });
  };
};
