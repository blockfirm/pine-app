import * as api from '../../../api';

export const BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_REQUEST = 'BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_REQUEST';
export const BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_SUCCESS = 'BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_SUCCESS';
export const BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_FAILURE = 'BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_FAILURE';

const getSubscriptionCountRequest = () => {
  return {
    type: BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_REQUEST
  };
};

const getSubscriptionCountSuccess = (numberOfSubscriptions) => {
  return {
    type: BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_SUCCESS,
    numberOfSubscriptions
  };
};

const getSubscriptionCountFailure = (error) => {
  return {
    type: BITCOIN_SUBSCRIPTIONS_GET_SUBSCRIPTION_COUNT_FAILURE,
    error
  };
};

/**
 * Action to get the number of subscriptions to push notifications.
 * Each subscription is a subscription to an address.
 */
export const getSubscriptionCount = () => {
  return (dispatch, getState) => {
    const state = getState();
    const apiOptions = { baseUrl: state.settings.api.baseUrl };
    const deviceToken = state.notifications.deviceToken;

    if (!deviceToken) {
      return Promise.resolve(0);
    }

    dispatch(getSubscriptionCountRequest());

    return api.bitcoin.subscriptions.getByDeviceToken(deviceToken, apiOptions)
      .then(({ numberOfSubscriptions }) => {
        dispatch(getSubscriptionCountSuccess(numberOfSubscriptions));
        return numberOfSubscriptions;
      })
      .catch((error) => {
        dispatch(getSubscriptionCountFailure(error));
        throw error;
      });
  };
};
