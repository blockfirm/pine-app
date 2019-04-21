import { save } from './save';

export const MESSAGES_REMOVE = 'MESSAGES_REMOVE';

/**
 * Action to remove a message.
 *
 * @param {string} contactId - ID of the contact to remove a message for.
 * @param {Object} message - Message to remove.
 * @param {string} message.id - ID of the message.
 *
 * @returns {Promise} A promise that resolves when the message has been removed.
 */
export const remove = (contactId, message) => {
  return (dispatch) => {
    /**
     * The actual message is removed by the reducer so this
     * action must be dispatched before saving the state.
     */
    dispatch({
      type: MESSAGES_REMOVE,
      contactId,
      message
    });

    return dispatch(save(contactId));
  };
};
