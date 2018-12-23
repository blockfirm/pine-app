import * as api from '../../../api';

export const BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_REQUEST = 'BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_REQUEST';
export const BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_SUCCESS = 'BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_SUCCESS';
export const BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_FAILURE = 'BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_FAILURE';

const unsubscribeRequest = () => {
  return {
    type: BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_REQUEST
  };
};

const unsubscribeSuccess = () => {
  return {
    type: BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_SUCCESS
  };
};

const unsubscribeFailure = (error) => {
  return {
    type: BITCOIN_SUBSCRIPTIONS_UNSUBSCRIBE_FAILURE,
    error
  };
};

/**
 * Action to unsubscribe from all push notifications.
 */
export const unsubscribe = () => {
  return (dispatch, getState) => {
    const state = getState();
    const apiOptions = { baseUrl: state.settings.api.baseUrl };
    const deviceToken = state.notifications.deviceToken;

    dispatch(unsubscribeRequest());

    return api.bitcoin.subscriptions.deleteByDeviceToken(deviceToken, apiOptions)
      .then(() => {
        dispatch(unsubscribeSuccess());
      })
      .catch((error) => {
        dispatch(unsubscribeFailure(error));
        throw error;
      });
  };
};
