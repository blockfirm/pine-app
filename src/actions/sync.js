import { sync as syncBitcoinWallet } from './bitcoin/wallet';
import { sync as syncContacts } from './contacts';
import { sync as syncMessages } from './messages';
import { syncIncoming as syncIncomingContactRequests } from './contacts/contactRequests';

export const SYNC_REQUEST = 'SYNC_REQUEST';
export const SYNC_SUCCESS = 'SYNC_SUCCESS';
export const SYNC_FAILURE = 'SYNC_FAILURE';

let syncPromise;

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
 * Action to sync contacts, contact requests, messages
 * and bitcoin wallet.
 */
export const sync = () => {
  return (dispatch, getState) => {
    const state = getState();

    if (state.syncing) {
      return syncPromise || Promise.resolve();
    }

    dispatch(syncRequest());

    syncPromise = dispatch(syncContacts())
      .then(() => dispatch(syncIncomingContactRequests()))
      .then(() => dispatch(syncMessages()))
      .then(() => dispatch(syncBitcoinWallet()))
      .then(() => dispatch(syncSuccess()))
      .catch((error) => dispatch(syncFailure(error)));

    return syncPromise;
  };
};
