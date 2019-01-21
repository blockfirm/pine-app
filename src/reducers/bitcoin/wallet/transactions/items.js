import deepmerge from 'deepmerge';
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
      const newTransaction = newTxidMap[transaction.txid];

      /**
       * It's important to only update certain fields of the transaction instead of
       * replacing it because the updated transaction doesn't contain all the
       * information, such as `prevOut`.
       */
      transaction.blockhash = newTransaction.blockhash;
      transaction.blocktime = newTransaction.blocktime;
      transaction.confirmations = newTransaction.confirmations;
    }

    return transaction;
  });

  return updatedTransactions;
};

const itemsReducer = (state = [], action) => {
  switch (action.type) {
    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_LOAD_SUCCESS:
      return action.transactions;

    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_ADD_SUCCESS:
      getUniqueTransactions(state, action.transactions).forEach((transaction) => {
        state.push(transaction);
      });

      // Sort ascending on time.
      state.sort((a, b) => a.time - b.time);

      return state;

    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_UPDATE_PENDING_SUCCESS:
      return updateTransactions(state, action.transactions);

    case transactionActions.BITCOIN_WALLET_TRANSACTIONS_REMOVE_ALL_SUCCESS:
      return [];

    default:
      return state;
  }
};

export default itemsReducer;
