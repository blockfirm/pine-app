import * as deviceTokens from '../../../clients/paymentServer/user/deviceTokens';
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

/**
 * Action to remove the current device token from the user's Pine account.
 */
export const remove = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { deviceToken } = state.notifications;
    const { credentials } = state.pine;

    if (!deviceToken || !credentials) {
      return Promise.resolve();
    }

    dispatch(removeRequest());

    // Add it first to get the ID of this device token.
    return dispatch(addDeviceToken())
      .then((deviceTokenId) => {
        return deviceTokens.remove(deviceTokenId, credentials);
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
