import * as contactRequests from '../../../PinePaymentProtocol/user/contactRequests';
import getMnemonicByKey from '../../../crypto/getMnemonicByKey';

export const PINE_CONTACT_REQUESTS_REMOVE_INCOMING_REQUEST = 'PINE_CONTACT_REQUESTS_REMOVE_INCOMING_REQUEST';
export const PINE_CONTACT_REQUESTS_REMOVE_INCOMING_SUCCESS = 'PINE_CONTACT_REQUESTS_REMOVE_INCOMING_SUCCESS';
export const PINE_CONTACT_REQUESTS_REMOVE_INCOMING_FAILURE = 'PINE_CONTACT_REQUESTS_REMOVE_INCOMING_FAILURE';

const removeIncomingRequest = () => {
  return {
    type: PINE_CONTACT_REQUESTS_REMOVE_INCOMING_REQUEST
  };
};

const removeIncomingSuccess = () => {
  return {
    type: PINE_CONTACT_REQUESTS_REMOVE_INCOMING_SUCCESS
  };
};

const removeIncomingFailure = (error) => {
  return {
    type: PINE_CONTACT_REQUESTS_REMOVE_INCOMING_FAILURE,
    error
  };
};

const getDefaultMnemonicFromKeys = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * Action to remove an incoming contact request from server.
 *
 * @param {string} contactRequestId - ID of the contact request to remove.
 */
export const removeIncoming = (contactRequestId) => {
  return (dispatch, getState) => {
    const state = getState();
    const keys = state.keys.items;
    const { pineAddress } = state.settings.user.profile;

    dispatch(removeIncomingRequest());

    return getDefaultMnemonicFromKeys(keys)
      .then((mnemonic) => {
        return contactRequests.removeIncoming(pineAddress, contactRequestId, mnemonic);
      })
      .then(() => {
        dispatch(removeIncomingSuccess());
      })
      .catch((error) => {
        dispatch(removeIncomingFailure(error));
        throw error;
      });
  };
};
