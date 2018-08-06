import * as transactionActions from '../../../../actions/bitcoin/wallet/transactions';

const createTxidMap = (transactions) => {
  const txidMap = {};

  transactions.forEach((transaction) => {
    txidMap[transaction.txid] = true;
  });

  return txidMap;
};

const getUniqueTransactions = (oldTransactions, transactions) => {
  const txidMap = createTxidMap(oldTransactions);
  const uniqueTransactions = [];

  transactions.forEach((transaction) => {
    if (transaction.txid in txidMap) {
      return;
    }

    uniqueTransactions.push(transaction);
    txidMap[transaction.txid] = true;
  });

  return uniqueTransactions;
};

const itemsReducer = (state = [], action) => {
  let newState;

  switch (action.type) {
    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS:
      return action.transactions;

    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS:
      newState = [
        ...state,
        ...getUniqueTransactions(state, action.transactions)
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
