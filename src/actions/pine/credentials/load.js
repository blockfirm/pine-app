import getMnemonicByKey from '../../../crypto/getMnemonicByKey';
import getUserIdFromPublicKey from '../../../pineApi/crypto/getUserIdFromPublicKey';

import {
  getAccountKeyPairFromMnemonic,
  getLightningKeyPairFromMnemonic
} from '../../../pineApi/crypto';

export const PINE_CREDENTIALS_LOAD_REQUEST = 'PINE_CREDENTIALS_LOAD_REQUEST';
export const PINE_CREDENTIALS_LOAD_SUCCESS = 'PINE_CREDENTIALS_LOAD_SUCCESS';
export const PINE_CREDENTIALS_LOAD_FAILURE = 'PINE_CREDENTIALS_LOAD_FAILURE';

const loadRequest = () => {
  return {
    type: PINE_CREDENTIALS_LOAD_REQUEST
  };
};

const loadSuccess = (credentials) => {
  return {
    type: PINE_CREDENTIALS_LOAD_SUCCESS,
    credentials
  };
};

const loadFailure = (error) => {
  return {
    type: PINE_CREDENTIALS_LOAD_FAILURE,
    error
  };
};

const getDefaultMnemonicFromKeys = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * Action to load Pine credentials into state.
 *
 * NOTE: Only the Pine credentials are stored in state and not the
 * private key that controls the bitcoin. The reason for storing
 * these credentials in memory is to increase performance - loading
 * and deriving the key pair is very slow (~2s on an iPhone X) and
 * freezes the whole app during this time.
 */
export const load = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { network } = state.settings.bitcoin;
    const { address } = state.settings.user.profile;
    const credentials = { address };

    if (!state.settings.initialized || !address) {
      return Promise.resolve();
    }

    if (state.pine.credentials !== null) {
      // The credentials have already been loaded into state.
      return Promise.resolve();
    }

    dispatch(loadRequest());

    return getDefaultMnemonicFromKeys(state.keys.items)
      .then((mnemonic) => {
        /**
         * This key pair can be used to authenticate pine requests but
         * can't sign bitcoin transactions. The mnemonic should NOT be
         * stored in state or memory.
         */
        credentials.keyPair = getAccountKeyPairFromMnemonic(mnemonic);
        credentials.userId = getUserIdFromPublicKey(credentials.keyPair.publicKey);

        /**
         * The lightning extended public key is stored in memory for
         * performance reasons since it is used more frequently.
         * Although it can spend off-chain funds, it cannot spend
         * on-chain funds.
         */
        const lightningKeyPair = getLightningKeyPairFromMnemonic(mnemonic, network);
        const extendedPublicKey = lightningKeyPair.neutered().toBase58();
        credentials.lightning = { extendedPublicKey };

        dispatch(loadSuccess(credentials));
      })
      .catch((error) => {
        dispatch(loadFailure(error));
        throw error;
      });
  };
};
