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

/**
 * Updates a list of transactions based on the transactions' txid.
 *
 * @param {array} oldTransactions - List of transactions.
 * @param {array} transactions - List of transactions to update.
 *
 * @returns {array} A new updated list of transactions.
 */
const updateTransactions = (oldTransactions, transactions) => {
  const newTxidMap = transactions.reduce((map, transaction) => {
    map[transaction.txid] = transaction;
    return map;
  }, {});

  const updatedTransactions = oldTransactions.map((transaction) => {
    if (transaction.txid in newTxidMap) {
      /**
       * Return the new transaction but with the old time. That's because
       * unconfirmed transactions will always have the current time until
       * they are confirmed. This should be fixed in the btcd node to use
       * the time it was added to the mempool instead.
       */
      const newTransaction = newTxidMap[transaction.txid];
      newTransaction.time = transaction.time;
      return newTransaction;
    }

    return transaction;
  });

  return updatedTransactions;
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

    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS:
      return updateTransactions(state, action.transactions);

    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS:
      return [];

    default:
      return state;
  }
};

export default itemsReducer;
