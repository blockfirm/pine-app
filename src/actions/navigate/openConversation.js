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
    params: { contactId: contact.id }
  });

  dispatch({ type: NAVIGATE_OPEN_CONVERSATION, contact });
  dispatch(pushAction);
};

/**
 * Action to navigate to a conversation for a contact/address.
 *
 * @param {Object|string} contact - Contact or address to navigate to.
 */
export const openConversation = (contact) => {
  return (dispatch, getState) => {
    const state = getState();

    if (!contact) {
      return;
    }

    /**
     * The app needs to be ready to be able to open a conversation.
     * If it's not ready, store it in state and this action will be
     * called again once the app is ready.
     */
    if (!state.ready) {
      return dispatch(deferOpenConversation(contact));
    }

    if (typeof contact === 'string') {
      // eslint-disable-next-line no-param-reassign
      contact = findContactByAddress(contact, state.contacts.items);
    }

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
