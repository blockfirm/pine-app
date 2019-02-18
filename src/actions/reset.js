import * as deviceTokens from '../PinePaymentProtocol/user/deviceTokens';
import removeMnemonicByKey from '../crypto/removeMnemonicByKey';
import getMnemonicByKey from '../crypto/getMnemonicByKey';
import { reset as resetBitcoinWallet } from './bitcoin/wallet';
import { remove as removeKey, removeBackup } from './keys';
import { removeAll as removeAllContacts } from './contacts';
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

const getDefaultMnemonicFromKeys = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

const removeDeviceTokenFromPineServer = (deviceToken, pineAddress, keys) => {
  return getDefaultMnemonicFromKeys(keys).then((mnemonic) => {
    // Add it first to get the ID of this device token.
    return deviceTokens.add(pineAddress, { ios: deviceToken }, mnemonic).then((deviceTokenId) => {
      return deviceTokens.remove(pineAddress, deviceTokenId, mnemonic);
    });
  });
};

/**
 * Action to reset the app and remove all data from
 * persistent storage, iCloud, and state.
 */
export const reset = (keepSettings) => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const { deviceToken } = state.notifications;
    const { pineAddress } = state.settings.user.profile;

    dispatch(resetRequest());

    return removeDeviceTokenFromPineServer(deviceToken, pineAddress, keys)
      .then(() => {
        const promises = [
          deleteKeys(dispatch, keys),
          dispatch(removeAllContacts()),
          dispatch(removeBackup()),
          dispatch(resetBitcoinWallet()),
          !keepSettings ? dispatch(resetSettings()) : null
        ];

        return Promise.all(promises);
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
