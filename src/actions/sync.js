import getMnemonicByKey from '../crypto/getMnemonicByKey';
import getKeyPairFromMnemonic from '../pineApi/crypto/getKeyPairFromMnemonic';
import getUserIdFromPublicKey from '../pineApi/crypto/getUserIdFromPublicKey';
import { sync as syncBitcoinWallet } from './bitcoin/wallet';
import { sync as syncContacts } from './contacts';
import { syncIncoming as syncIncomingContactRequests } from './contacts/contactRequests';

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

const getDefaultMnemonicFromKeys = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * Action to sync contacts, contact requests and bitcoin wallet.
 */
export const sync = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { address } = state.settings.user.profile;
    const credentials = { address };

    if (state.syncing) {
      return Promise.resolve();
    }

    dispatch(syncRequest());

    return getDefaultMnemonicFromKeys(state.keys.items)
      .then((mnemonic) => {
        credentials.mnemonic = mnemonic;
        credentials.keyPair = getKeyPairFromMnemonic(credentials.mnemonic);
        credentials.userId = getUserIdFromPublicKey(credentials.keyPair.publicKey);

        return dispatch(syncContacts(credentials));
      })
      .then(() => {
        return dispatch(syncIncomingContactRequests(credentials));
      })
      .then(() => {
        return dispatch(syncBitcoinWallet());
      })
      .then(() => {
        dispatch(syncSuccess());
      })
      .catch((error) => {
        dispatch(syncFailure(error));
      });
  };
};
