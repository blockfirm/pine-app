import * as transactionActions from '../../../../actions/bitcoin/wallet/transactions';

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_REQUEST:
    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_SAVE_REQUEST:
      return null;

    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_FAILURE:
    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_SAVE_FAILURE:
      return action.error;

    default:
      return state;
  }
};

export default errorReducer;
