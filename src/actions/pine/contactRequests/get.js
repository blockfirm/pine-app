import { get as getContactRequests } from '../../../PinePaymentProtocol/user/contactRequests';
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

/**
 * Action to get all contact requests from user's Pine server.
 */
export const get = () => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const { address } = state.settings.user.profile;

    if (!address) {
      return Promise.resolve();
    }

    dispatch(getRequest());

    return getDefaultMnemonicFromKeys(keys)
      .then((mnemonic) => {
        return getContactRequests(address, mnemonic);
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
