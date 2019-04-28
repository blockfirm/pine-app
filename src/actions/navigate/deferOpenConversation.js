export const NAVIGATE_DEFER_OPEN_CONVERSATION = 'NAVIGATE_DEFER_OPEN_CONVERSATION';

/**
 * Action to navigate to a conversation for a contact/address once the app is ready.
 *
 * @param {string} address - The contact's Pine address.
 */
export const deferOpenConversation = (address) => {
  return {
    type: NAVIGATE_DEFER_OPEN_CONVERSATION,
    address
  };
};
