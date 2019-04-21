import * as messagesActions from '../../actions/messages';

const error = (state = null, action) => {
  switch (action.type) {
    case messagesActions.MESSAGES_LOAD_REQUEST:
    case messagesActions.MESSAGES_SAVE_REQUEST:
    case messagesActions.MESSAGES_REMOVE_ALL_REQUEST:
    case messagesActions.MESSAGES_REMOVE_ALL_FOR_CONTACT_REQUEST:
      return null;

    case messagesActions.MESSAGES_LOAD_FAILURE:
    case messagesActions.MESSAGES_SAVE_FAILURE:
    case messagesActions.MESSAGES_REMOVE_ALL_FAILURE:
    case messagesActions.MESSAGES_REMOVE_ALL_FOR_CONTACT_FAILURE:
      return action.error;

    default:
      return state;
  }
};

export default error;
