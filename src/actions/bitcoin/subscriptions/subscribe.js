import * as api from '../../../api';

export const BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_REQUEST = 'BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_REQUEST';
export const BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_SUCCESS = 'BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_SUCCESS';
export const BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_FAILURE = 'BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_FAILURE';

const CHUNK_SIZE = 1000;

const subscribeRequest = () => {
  return {
    type: BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_REQUEST
  };
};

const subscribeSuccess = () => {
  return {
    type: BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_SUCCESS
  };
};

const subscribeFailure = (error) => {
  return {
    type: BITCOIN_SUBSCRIPTIONS_SUBSCRIBE_FAILURE,
    error
  };
};

const getChunks = (list, chunkSize) => {
  const chunks = [];

  for (let index = 0; index < list.length; index += chunkSize) {
    chunks.push(
      list.slice(index, index + chunkSize)
    );
  }

  return chunks;
};

const subscribeForAddresses = (dispatch, deviceToken, addresses, options) => {
  const addressChunks = getChunks(addresses, CHUNK_SIZE);

  const promises = addressChunks.map((chunk) => {
    return api.bitcoin.subscriptions.post(deviceToken, chunk, options);
  });

  return Promise.all(promises);
};

/**
 * Action to subscribe to push notifications for a list of addresses.
 *
 * @param {string} deviceToken - iOS device token to send notifications to.
 * @param {array} addresses - Bitcoin addresses to subscribe to.
 */
export const subscribe = (deviceToken, addresses) => {
  return (dispatch, getState) => {
    const settings = getState().settings;
    const options = { baseUrl: settings.api.baseUrl };

    dispatch(subscribeRequest());

    return subscribeForAddresses(dispatch, deviceToken, addresses, options)
      .then(() => {
        dispatch(subscribeSuccess());
      })
      .catch((error) => {
        dispatch(subscribeFailure(error));
        throw error;
      });
  };
};
