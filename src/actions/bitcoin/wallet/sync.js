/* eslint-disable max-lines */
import uuidv4 from 'uuid/v4';
import { InteractionManager } from 'react-native';

import getTransactionAmount from '../../../crypto/bitcoin/getTransactionAmount';
import getTransactionAddress from '../../../crypto/bitcoin/getTransactionAddress';
import { addLegacy as addLegacyContact } from '../../contacts';
import { add as addMessage } from '../../messages';
import { sync as syncAddressesWithPineAccount } from '../../paymentServer/addresses';
import { getNewByAddress as getNewTransactionsByAddress } from '../blockchain/transactions/getNewByAddress';
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

const flattenDeep = (array) => {
  return array.reduce((flattened, item) => {
    return Array.isArray(item) ? flattened.concat(flattenDeep(item)) : flattened.concat(item);
  }, []);
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
    return getUniqueTransactions(flattenDeep(results));
  });
};

// eslint-disable-next-line max-params
const addTransactionToContact = (transaction, contact, address, dispatch, state) => {
  const amountBtc = getTransactionAmount(
    transaction,
    state.bitcoin.wallet.addresses.external.items,
    state.bitcoin.wallet.addresses.internal.items
  );

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
};

const isLightningAddress = (address, state) => {
  const externalAddresses = state.bitcoin.wallet.addresses.external.items;
  const internalAddresses = state.bitcoin.wallet.addresses.internal.items;

  if (address in externalAddresses) {
    return Boolean(externalAddresses[address].lightning);
  }

  if (address in internalAddresses) {
    return Boolean(internalAddresses[address].lightning);
  }

  return false;
};

/**
 * Creates contacts and messages for transactions that wasn't sent using a Pine message.
 */
const createConversationsForTransactions = (transactions, dispatch, state) => {
  const promises = transactions.map((transaction) => {
    if (transaction.txid in state.messages.txids) {
      /**
       * Don't create contacts/messages for transactions that already
       * have a message (because it's a Pine transaction).
       */
      return;
    }

    const address = getTransactionAddress(
      transaction,
      state.bitcoin.wallet.addresses.external.items,
      state.bitcoin.wallet.addresses.internal.items
    );

    if (!address || isLightningAddress(address, state)) {
      return; // Don't display lightning funding/closing transactions.
    }

    const contacts = Object.values(state.contacts.items);

    const vendor = contacts.find(contact => {
      const { associatedAddresses } = contact;
      return associatedAddresses && associatedAddresses.includes(address);
    });

    if (vendor) {
      return addTransactionToContact(transaction, vendor, address, dispatch, state);
    }

    return dispatch(addLegacyContact({ address: null })).then((contact) => {
      return addTransactionToContact(transaction, contact, address, dispatch, state);
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
        dispatch(syncSuccess());
      })
      .catch((error) => {
        dispatch(syncFailure(error));
      });
  };
};
