import * as api from '../../../../api';

export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_REQUEST = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_REQUEST';
export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_SUCCESS = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_SUCCESS';
export const BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_FAILURE = 'BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_FAILURE';

const getByTxidRequest = () => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_REQUEST
  };
};

const getByTxidSuccess = (transaction) => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_SUCCESS,
    transaction
  };
};

const getByTxidFailure = (error) => {
  return {
    type: BITCOIN_BLOCKCHAIN_TRANSACTIONS_GET_BY_TXID_FAILURE,
    error
  };
};

/**
 * Action to get a transaction by txid (transaction hash).
 *
 * @param {string} txid - Hash of transaction to get.
 */
export const getByTxid = (txid) => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(getByTxidRequest());

    return api.bitcoin.transactions.getByTxid(txid, options)
      .then((transaction) => {
        dispatch(getByTxidSuccess(transaction));
        return transaction;
      })
      .catch((error) => {
        dispatch(getByTxidFailure(error));
        throw error;
      });
  };
};
