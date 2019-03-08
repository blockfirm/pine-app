import { removeOutgoing as removeOutgoingContactRequest } from '../../pine/contactRequests/removeOutgoing';
import { remove as removeContactFromServer } from '../../pine/contacts/remove';
import { save } from '../save';

export const CONTACTS_CONTACT_REQUESTS_REMOVE_REQUEST = 'CONTACTS_CONTACT_REQUESTS_REMOVE_REQUEST';
export const CONTACTS_CONTACT_REQUESTS_REMOVE_SUCCESS = 'CONTACTS_CONTACT_REQUESTS_REMOVE_SUCCESS';
export const CONTACTS_CONTACT_REQUESTS_REMOVE_FAILURE = 'CONTACTS_CONTACT_REQUESTS_REMOVE_FAILURE';

const removeRequest = () => {
  return {
    type: CONTACTS_CONTACT_REQUESTS_REMOVE_REQUEST
  };
};

const removeSuccess = (contact) => {
  return {
    type: CONTACTS_CONTACT_REQUESTS_REMOVE_SUCCESS,
    contact
  };
};

const removeFailure = (error) => {
  return {
    type: CONTACTS_CONTACT_REQUESTS_REMOVE_FAILURE,
    error
  };
};

/**
 * Action to remove an outgoing contact request.
 *
 * @param {object} contact - Contact with the contact request to remove.
 * @param {object} contact.id - Contact's ID.
 * @param {object} contact.address - Contact's Pine address.
 * @param {object} contact.userId - Contact's user ID.
 * @param {object} contact.contactRequest - Contact request to remove.
 * @param {string} contact.contactRequest.id - ID of the contact request.
 *
 * @returns {Promise} A promise that resolves to the contact of the removed contact request.
 */
export const remove = (contact) => {
  return (dispatch) => {
    dispatch(removeRequest());

    const contactRequest = {
      id: contact.contactRequest.id,
      to: contact.address,
      toUserId: contact.userId
    };

    return dispatch(removeOutgoingContactRequest(contactRequest))
      .catch((error) => {
        // Suppress Not Found errors.
        if (error.code !== 404) {
          throw error;
        }
      })
      .then(() => {
        return dispatch(removeContactFromServer(contact));
      })
      .then(() => {
        dispatch(removeSuccess(contact));
        return dispatch(save()).then(() => contact);
      })
      .catch((error) => {
        dispatch(removeFailure(error));
        throw error;
      });
  };
};
