import removeMnemonicByKey from '../crypto/removeMnemonicByKey';
import { reset as resetBitcoinWallet } from './bitcoin/wallet';
import { remove as removeKey } from './keys';
import { reset as resetSettings } from './settings';

export const RESET_REQUEST = 'RESET_REQUEST';
export const RESET_SUCCESS = 'RESET_SUCCESS';
export const RESET_FAILURE = 'RESET_FAILURE';

const resetRequest = () => {
  return {
    type: RESET_REQUEST
  };
};

const resetSuccess = () => {
  return {
    type: RESET_SUCCESS
  };
};

const resetFailure = (error) => {
  return {
    type: RESET_FAILURE,
    error
  };
};

const deleteKeys = (dispatch, keys) => {
  // Delete each key and its mnemonic.
  const promises = Object.values(keys).map((key) => {
    return removeMnemonicByKey(key.id).then(() => {
      return dispatch(removeKey(key));
    });
  });

  return Promise.all(promises);
};

/**
 * Action to reset the app and remove all data from persistent storage and state.
 */
export const reset = () => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;

    dispatch(resetRequest());

    const promises = [
      deleteKeys(dispatch, keys),
      dispatch(resetBitcoinWallet()),
      dispatch(resetSettings())
    ];

    return Promise.all(promises)
      .then(() => {
        dispatch(resetSuccess());
      })
      .catch((error) => {
        dispatch(resetFailure(error));
        throw error;
      });
  };
};
