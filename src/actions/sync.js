import { sync as syncBitcoinWallet } from './bitcoin/wallet';
import { syncContactRequests } from './contacts';

export const SYNC_REQUEST = 'SYNC_REQUEST';
export const SYNC_SUCCESS = 'SYNC_SUCCESS';
export const SYNC_FAILURE = 'SYNC_FAILURE';

const syncRequest = () => {
  return {
    type: SYNC_REQUEST
  };
};

const syncSuccess = () => {
  return {
    type: SYNC_SUCCESS
  };
};

const syncFailure = (error) => {
  return {
    type: SYNC_FAILURE,
    error
  };
};

/**
 * Action to sync contact requests and bitcoin wallet.
 */
export const sync = () => {
  return (dispatch, getState) => {
    const state = getState();

    if (state.syncing) {
      return Promise.resolve();
    }

    dispatch(syncRequest());

    const promises = [
      dispatch(syncContactRequests()),
      dispatch(syncBitcoinWallet())
    ];

    return Promise.all(promises)
      .then(() => {
        dispatch(syncSuccess());
      })
      .catch((error) => {
        dispatch(syncFailure(error));
        throw error;
      });
  };
};
