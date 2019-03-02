import { add as addContactToPine } from '../pine/contacts/add';
import { save } from './save';

export const CONTACTS_ACCEPT_CONTACT_REQUEST_REQUEST = 'CONTACTS_ACCEPT_CONTACT_REQUEST_REQUEST';
export const CONTACTS_ACCEPT_CONTACT_REQUEST_SUCCESS = 'CONTACTS_ACCEPT_CONTACT_REQUEST_SUCCESS';
export const CONTACTS_ACCEPT_CONTACT_REQUEST_FAILURE = 'CONTACTS_ACCEPT_CONTACT_REQUEST_FAILURE';

const acceptContactRequestRequest = () => {
  return {
    type: CONTACTS_ACCEPT_CONTACT_REQUEST_REQUEST
  };
};

const acceptContactRequestSuccess = (contact) => {
  return {
    type: CONTACTS_ACCEPT_CONTACT_REQUEST_SUCCESS,
    contact
  };
};

const acceptContactRequestFailure = (error) => {
  return {
    type: CONTACTS_ACCEPT_CONTACT_REQUEST_FAILURE,
    error
  };
};

/**
 * Action to accept a contact request.
 *
 * @param {object} contact - Contact with the contact request to accept.
 * @param {object} contact.contactRequest - Contact request to accept.
 * @param {string} contact.contactRequest.id - ID of the contact request.
 * @param {string} contact.contactRequest.from - Pine address of the sender of the request.
 *
 * @returns {Promise} A promise that resolves to the contact of the accepted contact request.
 */
export const acceptContactRequest = (contact) => {
  return (dispatch) => {
    dispatch(acceptContactRequestRequest());

    return dispatch(addContactToPine({ pineAddress: contact.contactRequest.from }))
      .then(({ id, createdAt }) => {
        const updatedContact = {
          ...contact,
          id,
          createdAt
        };

        delete updatedContact.contactRequest;

        dispatch(acceptContactRequestSuccess(updatedContact));

        return dispatch(save()).then(() => updatedContact);
      })
      .catch((error) => {
        dispatch(acceptContactRequestFailure(error));
        throw error;
      });
  };
};
