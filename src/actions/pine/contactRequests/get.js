import { get as getContactRequests } from '../../../pineApi/user/contactRequests';

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

/**
 * Action to get all contact requests from user's Pine server.
 */
export const get = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    if (!credentials) {
      return Promise.resolve();
    }

    dispatch(getRequest());

    return getContactRequests(credentials)
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
