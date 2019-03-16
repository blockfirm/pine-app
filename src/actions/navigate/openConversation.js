import { InteractionManager } from 'react-native';
import { StackActions } from 'react-navigation';

export const NAVIGATE_OPEN_CONVERSATION = 'NAVIGATE_OPEN_CONVERSATION';

const findContactByAddress = (address, contacts) => {
  return Object.values(contacts).find((contact) => {
    return contact.address === address;
  });
};

/**
 * Action to navigate to a conversation based on an address once the app is ready.
 */
export const openConversation = (address) => {
  return (dispatch, getState) => {
    const state = getState();

    if (!address) {
      return;
    }

    /**
     * The app needs to be ready to be able to open a conversation.
     * If it's not ready, store it in state and this action will be
     * called again once the app is ready.
     */
    if (!state.ready) {
      return dispatch({
        type: NAVIGATE_OPEN_CONVERSATION,
        address
      });
    }

    const contact = findContactByAddress(address, state.contacts.items);

    if (!contact) {
      return;
    }

    const pushAction = StackActions.push({
      routeName: 'Conversation',
      params: { contact }
    });

    dispatch(StackActions.popToTop());

    InteractionManager.runAfterInteractions(() => {
      dispatch(pushAction);
    });
  };
};
