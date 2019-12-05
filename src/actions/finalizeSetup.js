import { add as addDeviceTokenToPine } from './pine/deviceTokens/add';
import { load as loadPineCredentials } from './pine/credentials';
import { sync as syncApp } from './sync';
import { ready as onReady } from './ready';

export const FINALIZE_SETUP_REQUEST = 'FINALIZE_SETUP_REQUEST';
export const FINALIZE_SETUP_SUCCESS = 'FINALIZE_SETUP_SUCCESS';
export const FINALIZE_SETUP_FAILURE = 'FINALIZE_SETUP_FAILURE';

const finalizeSetupRequest = () => {
  return {
    type: FINALIZE_SETUP_REQUEST
  };
};

const finalizeSetupSuccess = () => {
  return {
    type: FINALIZE_SETUP_SUCCESS
  };
};

const finalizeSetupFailure = (error) => {
  return {
    type: FINALIZE_SETUP_FAILURE,
    error
  };
};

/**
 * Action to finalize the app setup.
 */
export const finalizeSetup = () => {
  return (dispatch) => {
    dispatch(finalizeSetupRequest());

    return dispatch(loadPineCredentials())
      .then(() => {
        return dispatch(addDeviceTokenToPine()).catch(() => {
          /**
           * Suppress errors as the account has still been created and
           * the device token will be added again every time at startup.
           */
        });
      })
      .then(() => {
        return dispatch(syncApp());
      })
      .then(() => {
        dispatch(finalizeSetupSuccess());
        dispatch(onReady());
      })
      .catch((error) => {
        dispatch(finalizeSetupFailure(error));
        throw error;
      });
  };
};
