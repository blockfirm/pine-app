import * as transactionActions from '../../../../actions/bitcoin/wallet/transactions';
import error from './error';
import items from './items';

const transactionsReducer = (state = {}, action) => {
  switch (action.type) {
    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS:

    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST:
    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS:
    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE:

    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS:

    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST:
    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_SAVE_SUCCESS:
    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE:
      return {
        ...state,
        error: error(state.error, action),
        items: items(state.items, action)
      };

    default:
      return state;
  }
};

export default transactionsReducer;
