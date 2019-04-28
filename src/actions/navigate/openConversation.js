import { InteractionManager } from 'react-native';
import { StackActions } from 'react-navigation';
import { deferOpenConversation } from './deferOpenConversation';

export const NAVIGATE_OPEN_CONVERSATION = 'NAVIGATE_OPEN_CONVERSATION';

const findContactByAddress = (address, contacts) => {
  return Object.values(contacts).find((contact) => {
    return contact.address === address;
  });
};

const navigateToConversation = (dispatch, contact) => {
  const pushAction = StackActions.push({
    routeName: 'Conversation',
    params: { contact }
  });

  dispatch({ type: NAVIGATE_OPEN_CONVERSATION, contact });
  dispatch(pushAction);
};

/**
 * Action to navigate to a conversation for a contact/address.
 *
 * @param {string} address - The contact's Pine address.
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
      return dispatch(deferOpenConversation(address));
    }

    const contact = findContactByAddress(address, state.contacts.items);

    if (!contact) {
      return;
    }

    // Navigate back to home first if a conversation already is open.
    if (state.navigate.activeConversation) {
      dispatch(StackActions.popToTop());

      return InteractionManager.runAfterInteractions(() => {
        navigateToConversation(dispatch, contact);
      });
    }

    return navigateToConversation(dispatch, contact);
  };
};
