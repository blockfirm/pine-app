import { save } from './save';

export const CONTACTS_SET_LAST_MESSAGE = 'CONTACTS_SET_LAST_MESSAGE';

/**
 * Action to attach the latest message to a contact. Used for displaying
 * details about the last payment on the contact in the list.
 *
 * @param {Object} contact - Contact to attach message to.
 * @param {string} contact.id - The contact's ID.
 * @param {Object} message - Message to attach.
 * @param {boolean} [persist] - Whether to save the state to persistent storage or not.
 */
export const setLastMessage = (contact, message, persist = true) => {
  return async (dispatch) => {
    dispatch({
      type: CONTACTS_SET_LAST_MESSAGE,
      contact,
      message
    });

    if (persist) {
      return dispatch(save());
    }
  };
};
