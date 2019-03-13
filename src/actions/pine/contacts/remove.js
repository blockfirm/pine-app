import removeContact from '../../../pineApi/user/contacts/remove';

export const PINE_CONTACTS_REMOVE_REQUEST = 'PINE_CONTACTS_REMOVE_REQUEST';
export const PINE_CONTACTS_REMOVE_SUCCESS = 'PINE_CONTACTS_REMOVE_SUCCESS';
export const PINE_CONTACTS_REMOVE_FAILURE = 'PINE_CONTACTS_REMOVE_FAILURE';

const removeRequest = () => {
  return {
    type: PINE_CONTACTS_REMOVE_REQUEST
  };
};

const removeSuccess = () => {
  return {
    type: PINE_CONTACTS_REMOVE_SUCCESS
  };
};

const removeFailure = (error) => {
  return {
    type: PINE_CONTACTS_REMOVE_FAILURE,
    error
  };
};

/**
 * Action to remove a contact from the user's Pine server.
 *
 * @param {object} contact - Contact to remove.
 * @param {string} contact.id - The contact's ID.
 */
export const remove = (contact) => {
  return (dispatch, getState) => {
    const state = getState();
    const { credentials } = state.pine;

    dispatch(removeRequest());

    return removeContact(contact.id, credentials)
      .then(() => {
        dispatch(removeSuccess());
      })
      .catch((error) => {
        dispatch(removeFailure(error));
        throw error;
      });
  };
};
