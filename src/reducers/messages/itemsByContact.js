import * as messagesActions from '../../actions/messages';

const itemsByContact = (state = {}, action) => {
  let messages;
  let newState;

  switch (action.type) {
    case messagesActions.MESSAGES_LOAD_SUCCESS:
      return {
        ...state,
        [action.contactId]: action.messages
      };

    case messagesActions.MESSAGES_ADD:
      messages = state[action.contactId] || [];

      return {
        ...state,
        [action.contactId]: [
          ...messages,
          action.message
        ]
      };

    case messagesActions.MESSAGES_REMOVE:
    case messagesActions.MESSAGES_REMOVE_ALL_FOR_CONTACT_SUCCESS:
      newState = { ...state };
      delete newState[action.contactId];
      return newState;

    case messagesActions.MESSAGES_CANCEL_PAYMENT_SUCCESS:
      messages = state[action.contactId];

      return {
        ...state,
        [action.contactId]: messages.map((message) => {
          if (message.id === action.messageId) {
            return {
              ...message,
              canceled: true
            };
          }

          return message;
        })
      };

    default:
      return state;
  }
};

export default itemsByContact;
