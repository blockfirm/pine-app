import * as contactRequests from '../../../clients/paymentServer/user/contactRequests';

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

/**
 * Action to remove an incoming contact request from server.
 *
 * @param {string} contactRequestId - ID of the contact request to remove.
 */
export const removeIncoming = (contactRequestId) => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    dispatch(removeIncomingRequest());

    return contactRequests.removeIncoming(contactRequestId, credentials)
      .then(() => {
        dispatch(removeIncomingSuccess());
      })
      .catch((error) => {
        dispatch(removeIncomingFailure(error));
        throw error;
      });
  };
};
