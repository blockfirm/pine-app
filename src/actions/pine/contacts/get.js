import getContacts from '../../../clients/paymentServer/user/contacts/get';

export const PINE_CONTACTS_GET_REQUEST = 'PINE_CONTACTS_GET_REQUEST';
export const PINE_CONTACTS_GET_SUCCESS = 'PINE_CONTACTS_GET_SUCCESS';
export const PINE_CONTACTS_GET_FAILURE = 'PINE_CONTACTS_GET_FAILURE';

const getRequest = () => {
  return {
    type: PINE_CONTACTS_GET_REQUEST
  };
};

const getSuccess = (contacts) => {
  return {
    type: PINE_CONTACTS_GET_SUCCESS,
    contacts
  };
};

const getFailure = (error) => {
  return {
    type: PINE_CONTACTS_GET_FAILURE,
    error
  };
};

/**
 * Action to get all contacts from the user's Pine server.
 */
export const get = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    dispatch(getRequest());

    return getContacts(credentials)
      .then((contacts) => {
        dispatch(getSuccess(contacts));
        return contacts;
      })
      .catch((error) => {
        dispatch(getFailure(error));
        throw error;
      });
  };
};
