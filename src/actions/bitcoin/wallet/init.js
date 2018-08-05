import { findByAccount as findAddressesByAccount } from '../blockchain/addresses/findByAccount';
import { add as addExternalAddresses } from './addresses/external';
import { add as addInternalAddresses } from './addresses/internal';
import { add as addTransactions } from './transactions';

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
    /**
    * Set the value to an empty object since no metadata
    * is stored about the address at the moment.
    */
    addressMap[address.address] = {};
  });

  return addressMap;
};

const getSortedTransactions = (addresses) => {
  const transactions = addresses.reduce((accumulator, address) => {
    return accumulator.concat(address.transactions);
  }, []);

  // Sort ascending on time.
  transactions.sort((a, b) => a.time - b.time);

  return transactions;
};

/**
 * Finds all addresses and transactions for an account and saves them to the state
 * and persistent storage. Only saves transactions for external addresses.
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
      // Only save external transactions.
      if (!internal) {
        const transactions = getSortedTransactions(addresses);
        return dispatch(addTransactions(transactions));
      }
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
        dispatch(initSuccess());
      })
      .catch((error) => {
        dispatch(initFailure(error));
        throw error;
      });
  };
};
