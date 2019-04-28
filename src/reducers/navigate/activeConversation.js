import {
  NAVIGATE_DEFER_OPEN_CONVERSATION,
  NAVIGATE_OPEN_CONVERSATION,
  NAVIGATE_CLOSE_CONVERSATION
} from '../../actions/navigate';

const activeConversation = (state = null, action) => {
  switch (action.type) {
    case NAVIGATE_OPEN_CONVERSATION:
      return {
        contact: action.contact
      };

    case NAVIGATE_DEFER_OPEN_CONVERSATION:
    case NAVIGATE_CLOSE_CONVERSATION:
      return null;

    default:
      return state;
  }
};

export default activeConversation;
