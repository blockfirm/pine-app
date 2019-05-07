export const NAVIGATE_DEFER_OPEN_CONVERSATION = 'NAVIGATE_DEFER_OPEN_CONVERSATION';

/**
 * Action to navigate to a conversation for a contact/address once the app is ready.
 *
 * @param {Object|string} contact - Contact or address to navigate to.
 */
export const deferOpenConversation = (contact) => {
  return {
    type: NAVIGATE_DEFER_OPEN_CONVERSATION,
    contact
  };
};
