import { AsyncStorage } from 'react-native';

export const BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_REQUEST = 'BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_REQUEST';
export const BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_SUCCESS = 'BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_SUCCESS';
export const BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_FAILURE = 'BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_FAILURE';

const BITCOIN_ADDRESSES_INTERNAL_STORAGE_KEY = '@Bitcoin/Addresses/Internal';

const saveRequest = () => {
  return {
    type: BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_REQUEST
  };
};

const saveSuccess = () => {
  return {
    type: BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_SUCCESS
  };
};

const saveFailure = (error) => {
  return {
    type: BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_FAILURE,
    error
  };
};

/**
 * Action to persist all addresses from state to AsyncStorage.
 */
export const save = () => {
  return (dispatch, getState) => {
    dispatch(saveRequest());

    const items = getState().bitcoin.wallet.addresses.internal.items;
    const serialized = JSON.stringify(items);

    return AsyncStorage.setItem(BITCOIN_ADDRESSES_INTERNAL_STORAGE_KEY, serialized)
      .then(() => {
        dispatch(saveSuccess());
      })
      .catch((error) => {
        dispatch(saveFailure(error));
        throw error;
      });
  };
};
