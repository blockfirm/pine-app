import * as deviceTokens from '../../../PinePaymentProtocol/user/deviceTokens';
import getMnemonicByKey from '../../../crypto/getMnemonicByKey';
import { add as addDeviceToken } from './add';

export const PINE_DEVICE_TOKEN_REMOVE_REQUEST = 'PINE_DEVICE_TOKEN_REMOVE_REQUEST';
export const PINE_DEVICE_TOKEN_REMOVE_SUCCESS = 'PINE_DEVICE_TOKEN_REMOVE_SUCCESS';
export const PINE_DEVICE_TOKEN_REMOVE_FAILURE = 'PINE_DEVICE_TOKEN_REMOVE_FAILURE';

const removeRequest = () => {
  return {
    type: PINE_DEVICE_TOKEN_REMOVE_REQUEST
  };
};

const removeSuccess = () => {
  return {
    type: PINE_DEVICE_TOKEN_REMOVE_SUCCESS
  };
};

const removeFailure = (error) => {
  return {
    type: PINE_DEVICE_TOKEN_REMOVE_FAILURE,
    error
  };
};

const getDefaultMnemonicFromKeys = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * Action to remove the current device token from the user's Pine account.
 */
export const remove = () => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const { deviceToken } = state.notifications;
    const { pineAddress } = state.settings.user.profile;

    if (!deviceToken || !pineAddress) {
      return Promise.resolve();
    }

    dispatch(removeRequest());

    return getDefaultMnemonicFromKeys(keys)
      .then((mnemonic) => {
        // Add it first to get the ID of this device token.
        return dispatch(addDeviceToken()).then((deviceTokenId) => {
          return deviceTokens.remove(pineAddress, deviceTokenId, mnemonic);
        });
      })
      .then(() => {
        dispatch(removeSuccess());
      })
      .catch((error) => {
        dispatch(removeFailure(error));
        throw error;
      });
  };
};
