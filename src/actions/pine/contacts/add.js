import addContact from '../../../pineApi/user/contacts/add';

export const PINE_CONTACTS_ADD_REQUEST = 'PINE_CONTACTS_ADD_REQUEST';
export const PINE_CONTACTS_ADD_SUCCESS = 'PINE_CONTACTS_ADD_SUCCESS';
export const PINE_CONTACTS_ADD_FAILURE = 'PINE_CONTACTS_ADD_FAILURE';

const addRequest = () => {
  return {
    type: PINE_CONTACTS_ADD_REQUEST
  };
};

const addSuccess = (contact) => {
  return {
    type: PINE_CONTACTS_ADD_SUCCESS,
    contact
  };
};

const addFailure = (error) => {
  return {
    type: PINE_CONTACTS_ADD_FAILURE,
    error
  };
};

/**
 * Action to add a contact to the user's Pine server.
 *
 * @param {object} contact - Contact to add.
 * @param {string} contact.address - The contact's Pine address.
 * @param {boolean} contact.waitingForContactRequest - Whether or not the user is waiting for the contact to accept a contact request.
 */
export const add = (contact) => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    dispatch(addRequest());

    return addContact(contact, credentials)
      .then((addedContact) => {
        dispatch(addSuccess(addedContact));
        return addedContact;
      })
      .catch((error) => {
        dispatch(addFailure(error));
        throw error;
      });
  };
};
