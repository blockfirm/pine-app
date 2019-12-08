import * as api from '../../../../clients/api';

export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_POST_REQUEST = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_POST_REQUEST';
export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_POST_SUCCESS = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_POST_SUCCESS';
export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_POST_FAILURE = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_POST_FAILURE';

const postRequest = () => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_POST_REQUEST
  };
};

const postSuccess = (transaction) => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_POST_SUCCESS,
    transaction
  };
};

const postFailure = (error) => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_POST_FAILURE,
    error
  };
};

/**
 * Action to broadcast a signed transaction to the bitcoin network.
 * The transaction must be serialized in raw format:
 * <https://bitcoin.org/en/developer-reference#raw-transaction-format>
 *
 * @param {string} transaction - Serialized and signed transaction in raw format.
 */
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
