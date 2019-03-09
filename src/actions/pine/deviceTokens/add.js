import * as deviceTokens from '../../../pineApi/user/deviceTokens';
import getMnemonicByKey from '../../../crypto/getMnemonicByKey';

export const PINE_DEVICE_TOKEN_ADD_REQUEST = 'PINE_DEVICE_TOKEN_ADD_REQUEST';
export const PINE_DEVICE_TOKEN_ADD_SUCCESS = 'PINE_DEVICE_TOKEN_ADD_SUCCESS';
export const PINE_DEVICE_TOKEN_ADD_FAILURE = 'PINE_DEVICE_TOKEN_ADD_FAILURE';

const addRequest = () => {
  return {
    type: PINE_DEVICE_TOKEN_ADD_REQUEST
  };
};

const addSuccess = (deviceTokenId) => {
  return {
    type: PINE_DEVICE_TOKEN_ADD_SUCCESS,
    deviceTokenId
  };
};

const addFailure = (error) => {
  return {
    type: PINE_DEVICE_TOKEN_ADD_FAILURE,
    error
  };
};

const getDefaultMnemonicFromKeys = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * Action to add the current device token to the user's Pine account.
 */
export const add = () => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const { deviceToken } = state.notifications;
    const { address } = state.settings.user.profile;

    if (!deviceToken || !address) {
      return Promise.resolve();
    }

    dispatch(addRequest());

    return getDefaultMnemonicFromKeys(keys)
      .then((mnemonic) => {
        return deviceTokens.add({ ios: deviceToken }, { address, mnemonic });
      })
      .then((deviceTokenId) => {
        dispatch(addSuccess(deviceTokenId));
        return deviceTokenId;
      })
      .catch((error) => {
        dispatch(addFailure(error));
        throw error;
      });
  };
};
