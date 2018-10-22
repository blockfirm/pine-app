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
 * Adds an address to the state and persistent storage.
 * @returns {promise} that resolves when the address has been added.
 */
const addAddress = (dispatch, address, internal) => {
  const addressMap = {
    [address]: {
      used: false
    }
  };

  if (internal) {
    return dispatch(addInternalAddress(addressMap));
  }

  return dispatch(addExternalAddress(addressMap));
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
  const network = state.settings.bitcoin.network;
  const keys = state.keys.items;
  const keyId = Object.keys(keys)[0];
  const key = keys[keyId];
  const currentIndex = getCurrentAddressIndex(state, internal);
  const newAddress = generateAddress(key.accountPublicKey, network, internal, currentIndex + 1);

  return newAddress;
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

    const newAddress = getNewUnused(state, internal);

    return addAddress(dispatch, newAddress, internal)
      .then(() => {
        dispatch(getUnusedSuccess(newAddress, internal));
        return newAddress;
      })
      .catch((error) => {
        dispatch(getUnusedFailure(error));
        throw error;
      });
  };
};
