import { AsyncStorage } from 'react-native';

export const BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_REQUEST = 'BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_REQUEST';
export const BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_SUCCESS = 'BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_SUCCESS';
export const BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_FAILURE = 'BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_FAILURE';

const BITCOIN_ADDRESSES_INTERNAL_STORAGE_KEY = '@Bitcoin/Addresses/Internal';

const loadRequest = () => {
  return {
    type: BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_REQUEST
  };
};

const loadSuccess = (addresses) => {
  return {
    type: BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_SUCCESS,
    addresses
  };
};

const loadFailure = (error) => {
  return {
    type: BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_FAILURE,
    error
  };
};

/**
 * Action to load persisted addresses into state. Returns a promise that
 * resolves to the loaded addresses as an object.
 */
export const load = () => {
  return (dispatch) => {
    dispatch(loadRequest());

    return AsyncStorage.getItem(BITCOIN_ADDRESSES_INTERNAL_STORAGE_KEY)
      .then((result) => {
        const addresses = JSON.parse(result) || {};
        dispatch(loadSuccess(addresses));
        return addresses;
      })
      .catch((error) => {
        dispatch(loadFailure(error));
        throw error;
      });
  };
};
