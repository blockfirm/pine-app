import {
  markAsUnread as markContactAsUnread,
  setLastMessage as setLastMessageToContact
} from '../contacts';

import { add as addToMessageTxIds } from './txids';
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
 * @param {boolean} [persistContact=true] - Whether to persist the contact changes or not.
 * @param {boolean} [markAsUnread=true] - Mark conversation as unread (only for received messages).
 *
 * @returns {Promise} A promise that resolves when the message has been added.
 */
export const add = (contactId, message, persistContact = true, markAsUnread = true) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { activeConversation } = state.navigate;
    const activeContact = activeConversation && activeConversation.contact;

    /**
     * Load existing messages from persistent storage
     * before adding the new message.
     */
    await loadExistingMessages(contactId, dispatch, state);

    // Add txid to the list of message transaction IDs.
    await dispatch(addToMessageTxIds(message.txid));

    /**
     * The message is added to the state by the reducer so this
     * action must be dispatched before saving the state.
     */
    dispatch({
      type: MESSAGES_ADD,
      contactId,
      message
    });

    /**
     * Mark contact as unread if message is received
     * and the contact chat is not active/open.
     */
    if (markAsUnread && message.from) {
      if (!activeContact || activeContact.id !== contactId) {
        await dispatch(markContactAsUnread({ id: contactId }, false));
      }
    }

    await dispatch(setLastMessageToContact({ id: contactId }, message, persistContact));

    return dispatch(save(contactId));
  };
};
