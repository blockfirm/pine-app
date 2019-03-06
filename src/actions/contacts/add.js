import { add as addContactToServer } from '../pine/contacts/add';
import { save } from './save';

export const CONTACTS_ADD_REQUEST = 'CONTACTS_ADD_REQUEST';
export const CONTACTS_ADD_SUCCESS = 'CONTACTS_ADD_SUCCESS';
export const CONTACTS_ADD_FAILURE = 'CONTACTS_ADD_FAILURE';

const addRequest = () => {
  return {
    type: CONTACTS_ADD_REQUEST
  };
};

const addSuccess = (contact) => {
  return {
    type: CONTACTS_ADD_SUCCESS,
    contact
  };
};

const addFailure = (error) => {
  return {
    type: CONTACTS_ADD_FAILURE,
    error
  };
};

/**
 * Action to add a contact.
 *
 * @param {object} contact - Contact to add.
 * @param {string} contact.pineAddress - The contact's Pine address.
 * @param {string} contact.userId - The contact's user ID.
 * @param {string} contact.publicKey - The contact's public key encoded as base58check.
 * @param {string} contact.username - The contact's username.
 * @param {string} contact.displayName - The contact's display name.
 * @param {boolean} contact.waitingForContactRequest - Whether or not the user is waiting for the contact to accept a contact request.
 * @param {object} contact.avatar - Metadata about the contact's avatar (optional).
 * @param {string} contact.avatar.checksum - A checksum of the avatar image.
 * @param {object} contact.contactRequest - A contact request to or from the user (optional).
 * @param {string} contact.contactRequest.id - ID of the contact request.
 * @param {string} contact.contactRequest.from - Pine address of the sender of the request.
 * @param {number} contact.contactRequest.createdAt - Unix timestamp of when the request was created.
 *
 * @returns {Promise} A promise that resolves to the added contact.
 */
export const add = (contact) => {
  return (dispatch) => {
    dispatch(addRequest());

    return dispatch(addContactToServer(contact))
      .then(({ id, createdAt }) => {
        contact.id = id;
        contact.createdAt = createdAt;

        dispatch(addSuccess(contact));

        return dispatch(save());
      })
      .then(() => contact)
      .catch((error) => {
        dispatch(addFailure(error));
        throw error;
      });
  };
};
