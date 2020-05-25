import { removeIncoming as removeIncomingContactRequest } from '../../paymentServer/contactRequests/removeIncoming';
import { save } from '../save';

export const CONTACTS_CONTACT_REQUESTS_IGNORE_REQUEST = 'CONTACTS_CONTACT_REQUESTS_IGNORE_REQUEST';
export const CONTACTS_CONTACT_REQUESTS_IGNORE_SUCCESS = 'CONTACTS_CONTACT_REQUESTS_IGNORE_SUCCESS';
export const CONTACTS_CONTACT_REQUESTS_IGNORE_FAILURE = 'CONTACTS_CONTACT_REQUESTS_IGNORE_FAILURE';

const ignoreRequest = () => {
  return {
    type: CONTACTS_CONTACT_REQUESTS_IGNORE_REQUEST
  };
};

const ignoreSuccess = (contact) => {
  return {
    type: CONTACTS_CONTACT_REQUESTS_IGNORE_SUCCESS,
    contact
  };
};

const ignoreFailure = (error) => {
  return {
    type: CONTACTS_CONTACT_REQUESTS_IGNORE_FAILURE,
    error
  };
};

/**
 * Action to ignore a contact request.
 *
 * @param {object} contact - Contact with the contact request to ignore.
 * @param {object} contact.contactRequest - Contact request to ignore.
 * @param {string} contact.contactRequest.id - ID of the contact request.
 * @param {string} contact.contactRequest.from - Pine address of the sender of the request.
 *
 * @returns {Promise} A promise that resolves to the contact of the ignored contact request.
 */
export const ignore = (contact) => {
  return (dispatch) => {
    dispatch(ignoreRequest());

    return dispatch(removeIncomingContactRequest(contact.contactRequest.id))
      .catch((error) => {
        if (error.name !== 'NotFound') {
          dispatch(ignoreFailure(error));
          throw error;
        }
      })
      .then(() => {
        dispatch(ignoreSuccess(contact));
        return dispatch(save()).then(() => contact);
      });
  };
};
