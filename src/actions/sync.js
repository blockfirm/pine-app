import { sync as syncBitcoinWallet } from './bitcoin/wallet';
import { sync as syncContacts, updateProfiles } from './contacts';
import { sync as syncMessages } from './messages';
import { sync as syncLightning } from './lightning';
import { sync as syncInvoices } from './lightning/invoices';
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
 * Action to sync contacts, contact requests, messages and bitcoin wallet.
 *
 * @param {Object} options - Sync options.
 * @param {bool} options.syncProfiles - Whether or not to also sync contact profiles (avatar etc.).
 * @param {bool} options.force - Force sync even if sync has been inactivated.
 *
 * @returns {Promise} A promise that resolves when the sync is complete.
 */
export const sync = (options) => {
  return (dispatch, getState) => {
    const state = getState();
    const syncProfiles = options && options.syncProfiles;
    const force = options && options.force;
    const errors = [];

    if (state.syncing || (!state.syncActive && !force)) {
      return syncPromise || Promise.resolve();
    }

    dispatch(syncRequest());

    syncPromise = dispatch(syncContacts())
      .then(() => dispatch(syncIncomingContactRequests()))
      .then(() => dispatch(syncInvoices())) // Sync invoices before messages as ligtning payments will depend on them.
      .then(() => dispatch(syncMessages()))
      .catch((error) => errors.push(error))
      .then(() => dispatch(syncBitcoinWallet()))
      .then(() => dispatch(syncLightning()))
      .then(() => syncProfiles && dispatch(updateProfiles()))
      .then(() => {
        if (errors.length) {
          throw errors[0];
        }
      })
      .then(() => dispatch(syncSuccess()))
      .catch((error) => dispatch(syncFailure(error)));

    return syncPromise;
  };
};
