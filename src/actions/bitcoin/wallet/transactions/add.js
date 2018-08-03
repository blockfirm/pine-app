import { save } from './save';

export const BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS = 'BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS';

export const addSuccess = (transactions) => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS,
    transactions
  };
};

/**
 * Action to add a list of bitcoin transactions to the state and persistent storage.
 *
 * @param {array} transactions - List of transactions to add.
 */
export const add = (transactions) => {
  return (dispatch) => {
    /**
     * The transactions are added to the state by the reducer,
     * so this action must be dispatched before saving the state.
     */
    dispatch(addSuccess(transactions));
    return dispatch(save()).then(() => transactions);
  };
};
