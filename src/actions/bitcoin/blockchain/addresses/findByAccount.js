import bip32 from 'bip32';
import bip39 from 'bip39';
import { getByAddress as getTransactionsByAddress } from '../transactions/getByAddress';
import getMnemonicByKey from '../../../../crypto/getMnemonicByKey';
import generateAddress from '../../../../crypto/bitcoin/generateAddress';

export const BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_BY_ACCOUNT_REQUEST = 'BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_BY_ACCOUNT_REQUEST';
export const BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_BY_ACCOUNT_SUCCESS = 'BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_BY_ACCOUNT_SUCCESS';
export const BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_BY_ACCOUNT_FAILURE = 'BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_BY_ACCOUNT_FAILURE';

const ADDRESS_SEARCH_SIZE = 10; // How many addresses to search transactions for each time.
const ADDRESS_GAP_LIMIT = 20; // How many empty addresses in a row before stopping the search.

const findByAccountRequest = () => {
  return {
    type: BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_BY_ACCOUNT_REQUEST
  };
};

const findByAccountSuccess = (addresses) => {
  return {
    type: BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_BY_ACCOUNT_SUCCESS,
    addresses
  };
};

const findByAccountFailure = (error) => {
  return {
    type: BITCOIN_BLOCKCHAIN_ADDRESSES_FIND_BY_ACCOUNT_FAILURE,
    error
  };
};

/**
 * Merges a transactions map with the previous result
 * by transforming the map into an array of objects.
 *
 * @param {array} result - List of addresses and transactions, [{ address, transactions }].
 * @param {object} transactionsMap - Object mapping addresses to list of transactions.
 */
const mergeResult = (prevResult, transactionsMap) => {
  const result = prevResult || [];

  Object.keys(transactionsMap).forEach((address) => {
    result.push({
      address,
      transactions: transactionsMap[address]
    });
  });

  return result;
};

/**
 * Removes trailing unused addresses from the result.
 *
 * @param {array} result - List of addresses and transactions, [{ address, transactions }].
 * @param {number} addressGap - Number of unused addresses that should be removed.
 */
const cleanResult = (result, addressGap) => {
  if (addressGap > 0) {
    // Remove the empty addresses at the end.
    return result.slice(0, -addressGap);
  }

  return result;
};

/**
 * Returns the number of consecutive unused addresses at the end of the list.
 * <https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#address-gap-limit>
 *
 * @param {array} addresses - List of addresses in the format of [{ address, transactions }].
 */
const getAddressGap = (addresses) => {
  const reversedAddresses = [...addresses];
  let unusedAddressesInRow = 0;

  reversedAddresses.reverse();

  reversedAddresses.every((address) => {
    if (address.transactions.length === 0) {
      unusedAddressesInRow++;
      return true;
    }

    return false;
  });

  return unusedAddressesInRow;
};

/**
 * Generates a specified amount of addresses starting at `addressInfo.addressIndex`.
 *
 * @param {object} addressInfo - An object describing an address using BIP44.
 * - @param {object} root - A bip32 root from a private key.
 * - @param {string} network - 'mainnet' or 'testnet'.
 * - @param {number} accountIndex - The index of the account to generate addresses for.
 * - @param {boolean} internal - Whether or not to generate internal addresses (change addresses).
 * - @param {number} addressIndex - The address index to start generating addresses from.
 * @param {number} amount - Number of addresses to generate.
 */
const generateAddresses = (addressInfo, amount) => {
  const addressIndexStart = addressInfo.addressIndex;
  const addressIndexEnd = addressIndexStart + amount;
  const addresses = [];

  for (let i = addressIndexStart; i < addressIndexEnd; i++) {
    const address = generateAddress({ ...addressInfo, addressIndex: i });
    addresses.push(address);
  }

  return addresses;
};

/**
 * Recursive function that looks for transactions for each address index
 * until it hits 20 unused addresses in a row. It then expects that there
 * are no used addresses beyond this point and stops searching.
 *
 * @param {function} dispatch - A redux dispatch function.
 * @param {object} addressInfo - An object describing an address using BIP44.
 * - @param {object} root - A bip32 root from a private key.
 * - @param {string} network - 'mainnet' or 'testnet'.
 * - @param {number} accountIndex - The index of the account starting at 0.
 * - @param {boolean} internal - Whether or not to search for internal addresses (change addresses).
 * - @param {number} addressIndex - The index of the address starting at 0.
 * @param {array} result - An aggregation of all addresses that has been searched and its transactions.
 */
const getAddressesForAccount = (dispatch, addressInfo, result) => {
  const addresses = generateAddresses(addressInfo, ADDRESS_SEARCH_SIZE);

  return dispatch(getTransactionsByAddress(addresses)).then((transactions) => {
    const newResult = mergeResult(result, transactions);
    const addressGap = getAddressGap(newResult);

    // End the search when the address gap limit has been reached.
    if (addressGap >= ADDRESS_GAP_LIMIT) {
      return cleanResult(newResult, addressGap);
    }

    addressInfo.addressIndex += ADDRESS_SEARCH_SIZE;

    return getAddressesForAccount(dispatch, addressInfo, newResult);
  });
};

/**
 * Action to discover all addresses for a BIP44 account.
 * <https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki>
 *
 * @param {number} accountIndex - The index of the account starting at 0.
 * @param {boolean} internal - Whether or not to search for internal addresses (change addresses).
 */
export const findByAccount = (accountIndex, internal = false) => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const keyId = Object.keys(keys)[0];
    const network = state.settings.bitcoin.network;

    dispatch(findByAccountRequest());

    return getMnemonicByKey(keyId).then((mnemonic) => {
      const seed = bip39.mnemonicToSeed(mnemonic);
      const root = bip32.fromSeed(seed);

      const addressInfo = {
        root,
        network,
        accountIndex,
        internal,
        addressIndex: 0
      };

      return getAddressesForAccount(dispatch, addressInfo)
        .then((addresses) => {
          dispatch(findByAccountSuccess(addresses));
          return addresses;
        })
        .catch((error) => {
          dispatch(findByAccountFailure(error));
          throw error;
        });
    });
  };
};
