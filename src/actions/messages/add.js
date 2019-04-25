import { save } from './save';
import { load } from './load';

export const MESSAGES_ADD = 'MESSAGES_ADD';

const loadExistingMessages = (contactId, dispatch, state) => {
  const messages = state.messages.itemsByContact[contactId];

  if (messages) {
    return Promise.resolve();
  }

  return dispatch(load(contactId));
};

/**
 * Action to add a message to a contact's conversation.
 *
 * @param {string} contactId - ID of the contact to add the message to.
 * @param {Object} message - Message to add.
 *
 * @returns {Promise} A promise that resolves when the message has been added.
 */
export const add = (contactId, message) => {
  return (dispatch, getState) => {
    const state = getState();

    /**
     * Load existing messages from persistent storage
     * before adding the new message.
     */
    return loadExistingMessages(contactId, dispatch, state).then(() => {
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
    });
  };
};
