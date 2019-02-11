import { getByTxid as getTransactionByTxid } from '../../blockchain/transactions/getByTxid';
import { save } from './save';

export const BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_REQUEST = 'BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_REQUEST';
export const BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS = 'BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS';
export const BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_FAILURE = 'BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_FAILURE';

const updatePendingRequest = () => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_REQUEST
  };
};

const updatePendingSuccess = (transactions) => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS,
    transactions
  };
};

const updatePendingFailure = (error) => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_FAILURE,
    error
  };
};

const getPendingTransactions = (transactions) => {
  return transactions.filter((transaction) => !transaction.confirmations);
};

/**
 * Action to update pending transactions.
 */
export const updatePending = () => {
  return (dispatch, getState) => {
    dispatch(updatePendingRequest());

    const state = getState();
    const transactions = state.bitcoin.wallet.transactions.items;
    const pendingTransactions = getPendingTransactions(transactions);

    const promises = pendingTransactions.map((transaction) => {
      return dispatch(getTransactionByTxid(transaction.txid));
    });

    return Promise.all(promises)
      .then((newTransactions) => {
        dispatch(updatePendingSuccess(newTransactions));

        if (newTransactions.length > 0) {
          return dispatch(save()).then(() => newTransactions);
        }

        return newTransactions;
      })
      .catch((error) => {
        dispatch(updatePendingFailure(error));
        throw error;
      });
  };
};
