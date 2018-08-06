import * as transactionActions from '../../../../actions/bitcoin/wallet/transactions';

const itemsReducer = (state = [], action) => {
  let newState;

  switch (action.type) {
    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS:
      return action.transactions;

    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS:
      newState = [
        ...state,
        ...action.transactions
      ];

      // Sort ascending on time.
      newState.sort((a, b) => a.time - b.time);

      return newState;

    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS:
      return [];

    default:
      return state;
  }
};

export default itemsReducer;
