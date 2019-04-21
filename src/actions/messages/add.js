import { save } from './save';

export const MESSAGES_ADD = 'MESSAGES_ADD';

/**
 * Action to add a message to a contact's conversation.
 *
 * @param {string} contactId - ID of the contact to add the message to.
 * @param {Object} message - Message to add.
 *
 * @returns {Promise} A promise that resolves when the message has been added.
 */
export const add = (contactId, message) => {
  return (dispatch) => {
    /**
     * The message is added to the state by the reducer so this
     * action must be dispatched before saving the state.
     */
    dispatch({
      type: MESSAGES_ADD,
      contactId,
      message
    });

    return dispatch(save(contactId));
  };
};
