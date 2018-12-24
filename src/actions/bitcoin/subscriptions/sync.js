import { getSubscriptionCount } from './getSubscriptionCount';
import { subscribe } from './subscribe';

export const BITCOIN_SUBSCRIPTIONS_SYNC_REQUEST = 'BITCOIN_SUBSCRIPTIONS_SYNC_REQUEST';
export const BITCOIN_SUBSCRIPTIONS_SYNC_SUCCESS = 'BITCOIN_SUBSCRIPTIONS_SYNC_SUCCESS';
export const BITCOIN_SUBSCRIPTIONS_SYNC_FAILURE = 'BITCOIN_SUBSCRIPTIONS_SYNC_FAILURE';

const syncRequest = () => {
  return {
    type: BITCOIN_SUBSCRIPTIONS_SYNC_REQUEST
  };
};

const syncSuccess = () => {
  return {
    type: BITCOIN_SUBSCRIPTIONS_SYNC_SUCCESS
  };
};

const syncFailure = (error) => {
  return {
    type: BITCOIN_SUBSCRIPTIONS_SYNC_FAILURE,
    error
  };
};

/**
 * Returns a list of bitcoin addresses sorted by their index.
 *
 * @param {object} addresses - Bitcoin addresses as a map ('address': { index }).
 *
 * @returns {array} of bitcoin addresses as strings sorted by their index.
 */
const getSortedAddresses = (addresses) => {
  const values = Object.keys(addresses).map((address) => ({
    ...addresses[address],
    address
  }));

  values.sort((a, b) => {
    if (a.index < b.index) {
      return -1;
    }

    if (a.index > b.index) {
      return 1;
    }

    return 0;
  });

  return values.map((value) => value.address);
};

/**
 * Action to sync push notification subscriptions.
 */
export const sync = () => {
  return (dispatch, getState) => {
    const state = getState();
    const externalAddresses = getSortedAddresses(state.bitcoin.wallet.addresses.external.items);
    const deviceToken = state.notifications.deviceToken;

    if (externalAddresses.length === 0 || !deviceToken) {
      return;
    }

    dispatch(syncRequest());

    return dispatch(getSubscriptionCount())
      .then((numberOfSubscriptions) => {
        const newAddresses = externalAddresses.slice(numberOfSubscriptions);

        if (newAddresses.length > 0) {
          return dispatch(subscribe(newAddresses));
        }
      })
      .then(() => {
        dispatch(syncSuccess());
      })
      .catch((error) => {
        dispatch(syncFailure(error));
        throw error;
      });
  };
};
