import { get as getContactRequests } from '../../../pineApi/user/contactRequests';
import getMnemonicByKey from '../../../crypto/getMnemonicByKey';

export const PINE_CONTACT_REQUESTS_GET_REQUEST = 'PINE_CONTACT_REQUESTS_GET_REQUEST';
export const PINE_CONTACT_REQUESTS_GET_SUCCESS = 'PINE_CONTACT_REQUESTS_GET_SUCCESS';
export const PINE_CONTACT_REQUESTS_GET_FAILURE = 'PINE_CONTACT_REQUESTS_GET_FAILURE';

const getRequest = () => {
  return {
    type: PINE_CONTACT_REQUESTS_GET_REQUEST
  };
};

const getSuccess = (contactRequests) => {
  return {
    type: PINE_CONTACT_REQUESTS_GET_SUCCESS,
    contactRequests
  };
};

const getFailure = (error) => {
  return {
    type: PINE_CONTACT_REQUESTS_GET_FAILURE,
    error
  };
};

const getDefaultMnemonicFromKeys = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

const getCredentials = (address, keys, credentials) => {
  if (credentials) {
    return Promise.resolve(credentials);
  }

  return getDefaultMnemonicFromKeys(keys).then((mnemonic) => {
    return { address, mnemonic };
  });
};

/**
 * Action to get all contact requests from user's Pine server.
 *
 * @param {object} credentials - Optional credentials to use for authentication.
 * @param {string} credentials.address - Pine address of the user to authenticate.
 * @param {string} credentials.mnemonic - Mnemonic to authenticate and sign the request with.
 * @param {object} credentials.keyPair - Optional bitcoinjs key pair instead of a mnemonic.
 * @param {string} credentials.userId - Optional user ID instead of deriving it from the mnemonic.
 */
export const get = (credentials) => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const { address } = state.settings.user.profile;

    if (!address) {
      return Promise.resolve();
    }

    dispatch(getRequest());

    return getCredentials(address, keys, credentials)
      .then((resolvedCredentials) => {
        return getContactRequests(resolvedCredentials);
      })
      .then((contactRequests) => {
        dispatch(getSuccess(contactRequests));
        return contactRequests;
      })
      .catch((error) => {
        dispatch(getFailure(error));
        throw error;
      });
  };
};
