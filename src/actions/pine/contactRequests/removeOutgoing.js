import * as contactRequests from '../../../pineApi/user/contactRequests';

export const PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_REQUEST = 'PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_REQUEST';
export const PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_SUCCESS = 'PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_SUCCESS';
export const PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_FAILURE = 'PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_FAILURE';

const removeOutgoingRequest = () => {
  return {
    type: PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_REQUEST
  };
};

const removeOutgoingSuccess = () => {
  return {
    type: PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_SUCCESS
  };
};

const removeOutgoingFailure = (error) => {
  return {
    type: PINE_CONTACT_REQUESTS_REMOVE_OUTGOING_FAILURE,
    error
  };
};

/**
 * Action to remove an outgoing contact request from server.
 *
 * @param {string} contactRequest - Contact request to remove.
 * @param {string} contactRequest.id - ID of the contact request to remove.
 * @param {string} contactRequest.to - Pine address the contact request was sent to.
 * @param {string} contactRequest.toUserId - ID of the user the contact request was sent to.
 */
export const removeOutgoing = (contactRequest) => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    dispatch(removeOutgoingRequest());

    return contactRequests.removeOutgoing(contactRequest, credentials)
      .then(() => {
        dispatch(removeOutgoingSuccess());
      })
      .catch((error) => {
        dispatch(removeOutgoingFailure(error));
        throw error;
      });
  };
};
