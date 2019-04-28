export const NAVIGATE_CLOSE_CONVERSATION = 'NAVIGATE_CLOSE_CONVERSATION';

/**
 * Action to flag that the active conversation was closed (navigated back).
 */
export const closeConversation = () => {
  return {
    type: NAVIGATE_CLOSE_CONVERSATION
  };
};
