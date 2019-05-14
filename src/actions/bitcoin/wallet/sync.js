/* eslint-disable max-lines */
import uuidv4 from 'uuid/v4';
import { InteractionManager } from 'react-native';
import getTransactionAmount from '../../../crypto/bitcoin/getTransactionAmount';
import getTransactionAddress from '../../../crypto/bitcoin/getTransactionAddress';
import { addLegacy as addLegacyContact } from '../../contacts';
import { add as addMessage } from '../../messages';
import { sync as syncAddressesWithPineAccount } from '../../pine/addresses';
import { getNewByAddress as getNewTransactionsByAddress } from '../blockchain/transactions/getNewByAddress';
import { sync as syncSubscriptions } from '../subscriptions/sync';
import { update as updateUtxos } from './utxos';
import { save as saveExternalAddresses } from './addresses/external';
import { save as saveInternalAddresses } from './addresses/internal';
import { flagAsUsed, getUnused as getUnusedAddress } from './addresses';

import {
  add as addTransactions,
  updatePending as updatePendingTransactions
} from './transactions';

export const BITCOIN_WALLET_SYNC_REQUEST = 'BITCOIN_WALLET_SYNC_REQUEST';
export const BITCOIN_WALLET_SYNC_SUCCESS = 'BITCOIN_WALLET_SYNC_SUCCESS';
export const BITCOIN_WALLET_SYNC_FAILURE = 'BITCOIN_WALLET_SYNC_FAILURE';

const syncRequest = () => {
  return {
    type: BITCOIN_WALLET_SYNC_REQUEST
  };
};

const syncSuccess = () => {
  return {
    type: BITCOIN_WALLET_SYNC_SUCCESS
  };
};

const syncFailure = (error) => {
  return {
    type: BITCOIN_WALLET_SYNC_FAILURE,
    error
  };
};

const waitForInteractions = () => {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(resolve);
  });
};

/**
 * Flags addresses found in the transaction list as being used.
 */
const flagAddressesAsUsed = (dispatch, addressTransactions) => {
  const addresses = Object.keys(addressTransactions);
  const usedAddresses = addresses.filter((address) => addressTransactions[address].length > 0);

  if (usedAddresses.length > 0) {
    dispatch(flagAsUsed(usedAddresses));
  }
};

const concatTransactions = (addressTransactions) => {
  return Object.values(addressTransactions).reduce((accumulator, transactions) => {
    return accumulator.concat(transactions);
  }, []);
};

/**
 * Gets new transactions for a list of maximum 20 addresses and saves them to the state
 * and persistent storage.
 *
 * @param {function} dispatch - A redux dispatch function.
 * @param {array} addresses - List of addresses (strings) to get new transactions for. Max 20.
 * @param {array} oldTransactions - List of old transactions. Used to identify old transactions.
 */
const getNewTransactionsForBatch = (dispatch, addresses, oldTransactions) => {
  return waitForInteractions()
    .then(() => {
      return dispatch(getNewTransactionsByAddress(addresses, oldTransactions));
    })
    .then((transactions) => {
      return waitForInteractions().then(() => transactions);
    })
    .then((transactions) => {
      // Flag addresses with transactions as used.
      flagAddressesAsUsed(dispatch, transactions);
      return transactions;
    })
    .then((transactions) => {
      // Concat all transactions from all addresses.
      return concatTransactions(transactions);
    })
    .then((transactions) => {
      // Save transactions.
      if (transactions.length > 0) {
        return dispatch(addTransactions(transactions)).then(() => transactions);
      }
    });
};

/**
 * Gets new transactions for a list of addresses and saves them to the state
 * and persistent storage.
 *
 * @param {function} dispatch - A redux dispatch function.
 * @param {array} addresses - List of addresses (strings) to get new transactions for.
 * @param {array} oldTransactions - List of old transactions. Used to identify old transactions.
 */
const getNewTransactions = (dispatch, addresses, oldTransactions) => {
  const chunkSize = 20;
  const chunks = [];

  // Split the addresses array into chunks of 20.
  for (let i = 0; i < addresses.length; i += chunkSize) {
    chunks.push(addresses.slice(i, i + chunkSize));
  }

  // Get new transactions for each chunk of addresses.
  const promises = chunks.map((chunk) => {
    return getNewTransactionsForBatch(dispatch, chunk, oldTransactions);
  });

  return Promise.all(promises);
};

const getUniqueTransactions = (transactions) => {
  const txidMap = {};

  return transactions.filter((transaction) => {
    if (!transaction || txidMap[transaction.txid]) {
      return false;
    }

    txidMap[transaction.txid] = true;
    return true;
  });
};

const getAllNewTransactions = (dispatch, state) => {
  const externalAddresses = Object.keys(state.bitcoin.wallet.addresses.external.items);
  const internalAddresses = Object.keys(state.bitcoin.wallet.addresses.internal.items);
  const transactions = state.bitcoin.wallet.transactions.items;

  const promises = [
    getNewTransactions(dispatch, externalAddresses, transactions),
    getNewTransactions(dispatch, internalAddresses, transactions)
  ];

  return Promise.all(promises).then((results) => {
    return getUniqueTransactions(results.flat(2));
  });
};

/**
 * Creates contacts and messages for transactions that wasn't sent using a Pine message.
 */
const createConversationsForTransactions = (transactions, dispatch, state) => {
  const promises = transactions.map((transaction) => {
    if (transaction.txid in state.messages.txids) {
      // Don't create contacts/messages for transactions that already has a message.
      return;
    }

    const amountBtc = getTransactionAmount(
      transaction,
      state.bitcoin.wallet.addresses.external.items,
      state.bitcoin.wallet.addresses.internal.items
    );

    const address = getTransactionAddress(
      transaction,
      state.bitcoin.wallet.addresses.external.items,
      state.bitcoin.wallet.addresses.internal.items
    );

    return dispatch(addLegacyContact({ address: null })).then((contact) => {
      const message = {
        id: uuidv4(),
        type: 'payment',
        from: amountBtc < 0 ? address : 'unknown',
        address: { address },
        createdAt: transaction.time,
        txid: transaction.txid,
        amountBtc: Math.abs(amountBtc)
      };

      // Add message to conversation.
      return dispatch(addMessage(contact.id, message));
    });
  });

  return Promise.all(promises);
};

/**
 * Action to sync the wallet by loading new transactions from
 * the bitcoin blockchain and updating pending ones.
 */
export const sync = () => {
  return (dispatch, getState) => {
    const state = getState();
    let updatedTransactions = [];
    let newTransactions = [];

    if (state.bitcoin.wallet.syncing) {
      return Promise.resolve();
    }

    dispatch(syncRequest());

    // First update pending transactions.
    return dispatch(updatePendingTransactions())
      .then((transactions) => {
        updatedTransactions = transactions;

        // Get new transactions.
        return getAllNewTransactions(dispatch, state);
      })
      .then((transactions) => {
        newTransactions = transactions;

        if (newTransactions.length === 0 && updatedTransactions.length === 0) {
          return;
        }

        return waitForInteractions()
          .then(() => {
            // Save addresses that has been flagged as used.
            return Promise.all([
              dispatch(saveExternalAddresses()),
              dispatch(saveInternalAddresses())
            ]);
          })
          .then(() => {
            // Update the utxo set.
            return dispatch(updateUtxos());
          });
      })
      .then(() => {
        // Creates contacts and messages for transactions.
        return createConversationsForTransactions(newTransactions, dispatch, state);
      })
      .then(() => {
        // Load an unused address into state.
        return Promise.all([
          dispatch(getUnusedAddress()), // External address.
          dispatch(getUnusedAddress(true)) // Internal address.
        ]);
      })
      .then(() => {
        return dispatch(syncAddressesWithPineAccount(newTransactions));
      })
      .then(() => {
        // Subscribe to push notifications.
        return dispatch(syncSubscriptions());
      })
      .then(() => {
        dispatch(syncSuccess());
      })
      .catch((error) => {
        dispatch(syncFailure(error));
      });
  };
};
