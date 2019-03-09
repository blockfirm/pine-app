import * as contactRequests from '../../../pineApi/user/contactRequests';
import getMnemonicByKey from '../../../crypto/getMnemonicByKey';

export const PINE_CONTACT_REQUESTS_SEND_REQUEST = 'PINE_CONTACT_REQUESTS_SEND_REQUEST';
export const PINE_CONTACT_REQUESTS_SEND_SUCCESS = 'PINE_CONTACT_REQUESTS_SEND_SUCCESS';
export const PINE_CONTACT_REQUESTS_SEND_FAILURE = 'PINE_CONTACT_REQUESTS_SEND_FAILURE';

const sendRequest = () => {
  return {
    type: PINE_CONTACT_REQUESTS_SEND_REQUEST
  };
};

const sendSuccess = (contact) => {
  return {
    type: PINE_CONTACT_REQUESTS_SEND_SUCCESS,
    contact
  };
};

const sendFailure = (error) => {
  return {
    type: PINE_CONTACT_REQUESTS_SEND_FAILURE,
    error
  };
};

const getDefaultMnemonicFromKeys = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * Action to send a contact request to another Pine user.
 *
 * @param {string} to - Pine address to send the request to.
 */
export const send = (to) => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const { address } = state.settings.user.profile;

    dispatch(sendRequest());

    return getDefaultMnemonicFromKeys(keys)
      .then((mnemonic) => {
        return contactRequests.create(to, { address, mnemonic });
      })
      .then(({ contact }) => {
        dispatch(sendSuccess(contact));
        return contact;
      })
      .catch((error) => {
        dispatch(sendFailure(error));
        throw error;
      });
  };
};
