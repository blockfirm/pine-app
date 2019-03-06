import { add as addContactToServer } from '../../pine/contacts/add';
import { send as sendContactRequest } from '../../pine/contactRequests/send';
import { save } from '../save';

export const CONTACTS_CONTACT_REQUESTS_ACCEPT_REQUEST = 'CONTACTS_CONTACT_REQUESTS_ACCEPT_REQUEST';
export const CONTACTS_CONTACT_REQUESTS_ACCEPT_SUCCESS = 'CONTACTS_CONTACT_REQUESTS_ACCEPT_SUCCESS';
export const CONTACTS_CONTACT_REQUESTS_ACCEPT_FAILURE = 'CONTACTS_CONTACT_REQUESTS_ACCEPT_FAILURE';

const acceptRequest = () => {
  return {
    type: CONTACTS_CONTACT_REQUESTS_ACCEPT_REQUEST
  };
};

const acceptSuccess = (contact) => {
  return {
    type: CONTACTS_CONTACT_REQUESTS_ACCEPT_SUCCESS,
    contact
  };
};

const acceptFailure = (error) => {
  return {
    type: CONTACTS_CONTACT_REQUESTS_ACCEPT_FAILURE,
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
export const accept = (contact) => {
  return (dispatch) => {
    dispatch(acceptRequest());

    return dispatch(sendContactRequest(contact.contactRequest.from))
      .then(() => {
        return dispatch(addContactToServer({
          pineAddress: contact.contactRequest.from
        }));
      })
      .then(({ id, createdAt }) => {
        const updatedContact = {
          ...contact,
          id,
          createdAt
        };

        delete updatedContact.contactRequest;

        dispatch(acceptSuccess(updatedContact));

        return dispatch(save()).then(() => updatedContact);
      })
      .catch((error) => {
        dispatch(acceptFailure(error));
        throw error;
      });
  };
};
