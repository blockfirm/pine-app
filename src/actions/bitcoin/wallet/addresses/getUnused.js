import bip32 from 'bip32';
import bip39 from 'bip39';

import getMnemonicByKey from '../../../../crypto/getMnemonicByKey';
import generateAddress from '../../../../crypto/bitcoin/generateAddress';
import { add as addExternalAddress } from './external';
import { add as addInternalAddress } from './internal';

export const BITCOIN_WALLET_ADDRESSES_GET_UNUSED_REQUEST = 'BITCOIN_WALLET_ADDRESSES_GET_UNUSED_REQUEST';
export const BITCOIN_WALLET_ADDRESSES_GET_UNUSED_SUCCESS = 'BITCOIN_WALLET_ADDRESSES_GET_UNUSED_SUCCESS';
export const BITCOIN_WALLET_ADDRESSES_GET_UNUSED_FAILURE = 'BITCOIN_WALLET_ADDRESSES_GET_UNUSED_FAILURE';

const getUnusedRequest = () => {
  return {
    type: BITCOIN_WALLET_ADDRESSES_GET_UNUSED_REQUEST
  };
};

const getUnusedSuccess = (address, internal) => {
  return {
    type: BITCOIN_WALLET_ADDRESSES_GET_UNUSED_SUCCESS,
    address,
    internal
  };
};

const getUnusedFailure = (error) => {
  return {
    type: BITCOIN_WALLET_ADDRESSES_GET_UNUSED_FAILURE,
    error
  };
};

/**
 * Generates an address based on the inputs.
 * The account is hardcoded to 0.
 */
const getAddressByIndex = (root, network, internal, index) => {
  const addressInfo = {
    root,
    network,
    accountIndex: 0,
    internal,
    addressIndex: index
  };

  return generateAddress(addressInfo);
};

/**
 * Adds an address to the state and persistent storage.
 * @returns {promise} that resolves when the address has been added.
 */
const addAddress = (dispatch, address, internal) => {
  let promise;

  const addressMap = {
    [address]: {
      used: false
    }
  };

  if (internal) {
    promise = dispatch(addInternalAddress(addressMap));
  } else {
    promise = dispatch(addExternalAddress(addressMap));
  }

  return promise.then(() => address);
};

const getCurrentAddressIndex = (state, internal) => {
  let allAddresses;

  if (internal) {
    allAddresses = state.bitcoin.wallet.addresses.internal.items;
  } else {
    allAddresses = state.bitcoin.wallet.addresses.external.items;
  }

  const length = Object.keys(allAddresses).length;
  const currentIndex = length > 0 ? length - 1 : 0;

  return currentIndex;
};

const getExistingUnused = (state, internal) => {
  let allAddresses;

  if (internal) {
    allAddresses = state.bitcoin.wallet.addresses.internal.items;
  } else {
    allAddresses = state.bitcoin.wallet.addresses.external.items;
  }

  const unusedAddress = Object.keys(allAddresses).find((address) => {
    return !allAddresses[address].used;
  });

  return unusedAddress;
};

const getNewUnused = (state, internal) => {
  const keys = state.keys.items;
  const keyId = Object.keys(keys)[0];
  const network = state.settings.bitcoin.network;

  return getMnemonicByKey(keyId).then((mnemonic) => {
    const seed = bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed);
    const currentIndex = getCurrentAddressIndex(state, internal);
    const newAddress = getAddressByIndex(root, network, internal, currentIndex + 1);

    return newAddress;
  });
};

/**
 * Action to get an unused bitcoin address for this wallet.
 */
export const getUnused = (internal = false) => {
  return (dispatch, getState) => {
    dispatch(getUnusedRequest());

    const state = getState();
    const existingAddress = getExistingUnused(state, internal);

    if (existingAddress) {
      dispatch(getUnusedSuccess(existingAddress, internal));
      return Promise.resolve(existingAddress);
    }

    return getNewUnused(state, internal)
      .then((address) => {
        return addAddress(dispatch, address, internal);
      })
      .then((address) => {
        dispatch(getUnusedSuccess(address, internal));
        return address;
      })
      .catch((error) => {
        dispatch(getUnusedFailure(error));
        throw error;
      });
  };
};
