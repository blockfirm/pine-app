import { findByAccount as findAddressesByAccount } from '../blockchain/addresses/findByAccount';
import { add as addExternalAddresses } from './addresses/external';
import { add as addInternalAddresses } from './addresses/internal';
import { getUnused as getUnusedAddress } from './addresses';
import { add as addTransactions } from './transactions';
import { update as updateUtxos } from './utxos';

export const BITCOIN_WALLET_INIT_REQUEST = 'BITCOIN_WALLET_INIT_REQUEST';
export const BITCOIN_WALLET_INIT_SUCCESS = 'BITCOIN_WALLET_INIT_SUCCESS';
export const BITCOIN_WALLET_INIT_FAILURE = 'BITCOIN_WALLET_INIT_FAILURE';

const initRequest = () => {
  return {
    type: BITCOIN_WALLET_INIT_REQUEST
  };
};

const initSuccess = () => {
  return {
    type: BITCOIN_WALLET_INIT_SUCCESS
  };
};

const initFailure = (error) => {
  return {
    type: BITCOIN_WALLET_INIT_FAILURE,
    error
  };
};

const getAddressMap = (addresses) => {
  const addressMap = {};

  addresses.forEach((address) => {
    const hasTransactions = address.transactions && address.transactions.length > 0;

    addressMap[address.address] = {
      used: hasTransactions
    };
  });

  return addressMap;
};

const getTransactions = (addresses) => {
  const transactions = addresses.reduce((accumulator, address) => {
    return accumulator.concat(address.transactions);
  }, []);

  return transactions;
};

/**
 * Finds all addresses and transactions for an account and saves them to the state
 * and persistent storage.
 *
 * @param {function} dispatch - A redux dispatch function.
 * @param {number} accountIndex - The index of the account starting at 0.
 * @param {boolean} internal - Whether or not to search for internal addresses (change addresses).
 */
const findAndSaveAddresses = (dispatch, accountIndex, internal) => {
  return dispatch(findAddressesByAccount(accountIndex, internal))
    .then((addresses) => {
      // Save addresses.
      const addressMap = getAddressMap(addresses);

      if (internal) {
        return dispatch(addInternalAddresses(addressMap)).then(() => addresses);
      }

      return dispatch(addExternalAddresses(addressMap)).then(() => addresses);
    }).then((addresses) => {
      // Save transactions.
      const transactions = getTransactions(addresses);
      return dispatch(addTransactions(transactions));
    });
};

/**
 * Action to initiate a wallet by finding its addresses and
 * loading its transaction history from the bitcoin blockchain.
 */
export const init = () => {
  return (dispatch) => {
    const accountIndex = 0; // Only supports one account at the moment.

    dispatch(initRequest());

    const promises = [
      findAndSaveAddresses(dispatch, accountIndex, false), // External addresses.
      findAndSaveAddresses(dispatch, accountIndex, true) // Internal addresses.
    ];

    return Promise.all(promises)
      .then(() => {
        // Load an unused address into state.
        return Promise.all([
          dispatch(getUnusedAddress()), // External address.
          dispatch(getUnusedAddress(true)) // Internal address.
        ]);
      })
      .then(() => {
        // Generate a utxo set.
        return dispatch(updateUtxos());
      })
      .then(() => {
        dispatch(initSuccess());
      })
      .catch((error) => {
        dispatch(initFailure(error));
        throw error;
      });
  };
};
