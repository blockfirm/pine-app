import * as deviceTokens from '../../../clients/paymentServer/user/deviceTokens';

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

/**
 * Action to add the current device token to the user's Pine account.
 */
export const add = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { deviceToken } = state.notifications;
    const { credentials } = state.pine;

    if (!deviceToken || !credentials) {
      return Promise.resolve();
    }

    dispatch(addRequest());

    return deviceTokens.add({ ios: deviceToken }, credentials)
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
