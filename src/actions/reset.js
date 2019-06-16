import AsyncStorage from '@react-native-community/async-storage';
import { remove as removeDeviceTokenFromServer } from './pine/deviceTokens';
import removeMnemonicByKey from '../crypto/removeMnemonicByKey';
import { remove as removeKey, removeBackup } from './keys';
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

const deleteKeys = async (dispatch, keys) => {
  if (!keys) {
    return;
  }

  // Delete each key and its mnemonic.
  for (const key of Object.values(keys)) {
    await removeMnemonicByKey(key.id);
    await dispatch(removeKey(key));
  }
};

/**
 * Action to reset the app and remove all data from
 * persistent storage, iCloud, and state.
 */
export const reset = (keepSettings, keepBackup = true) => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const pineAddress = state.settings.user.profile.address;

    dispatch(resetRequest());

    return dispatch(removeDeviceTokenFromServer())
      .then(() => {
        return deleteKeys(dispatch, keys);
      })
      .then(() => {
        if (!keepBackup) {
          return dispatch(removeBackup(pineAddress));
        }
      })
      .then(() => {
        if (!keepSettings) {
          return dispatch(resetSettings());
        }
      })
      .then(() => {
        return AsyncStorage.clear().catch(() => {});
      })
      .then(() => {
        dispatch(resetSuccess());
      })
      .catch((error) => {
        dispatch(resetFailure(error));
        throw error;
      });
  };
};
