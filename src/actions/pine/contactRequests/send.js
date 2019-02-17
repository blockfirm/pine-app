import * as contactRequests from '../../../PinePaymentProtocol/user/contactRequests';
import getMnemonicByKey from '../../../crypto/getMnemonicByKey';

export const PINE_CONTACT_REQUESTS_SEND_REQUEST = 'PINE_CONTACT_REQUESTS_SEND_REQUEST';
export const PINE_CONTACT_REQUESTS_SEND_SUCCESS = 'PINE_CONTACT_REQUESTS_SEND_SUCCESS';
export const PINE_CONTACT_REQUESTS_SEND_FAILURE = 'PINE_CONTACT_REQUESTS_SEND_FAILURE';

const sendRequest = () => {
  return {
    type: PINE_CONTACT_REQUESTS_SEND_REQUEST
  };
};

const sendSuccess = (contactRequestId) => {
  return {
    type: PINE_CONTACT_REQUESTS_SEND_SUCCESS,
    contactRequestId
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
 * Action to send a contact request.
 */
export const send = (to) => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const { pineAddress } = state.settings.user.profile;

    if (!pineAddress) {
      return Promise.resolve();
    }

    dispatch(sendRequest());

    return getDefaultMnemonicFromKeys(keys)
      .then((mnemonic) => {
        return contactRequests.create(to, pineAddress, mnemonic);
      })
      .then((contactRequestId) => {
        dispatch(sendSuccess(contactRequestId));
        return contactRequestId;
      })
      .catch((error) => {
        dispatch(sendFailure(error));
        throw error;
      });
  };
};
