import { READY } from '../../actions';

import {
  NAVIGATE_DEFER_OPEN_CONVERSATION,
  NAVIGATE_OPEN_CONVERSATION
} from '../../actions/navigate';

const deferredOpenConversation = (state = null, action) => {
  switch (action.type) {
    case NAVIGATE_DEFER_OPEN_CONVERSATION:
      return action.contact;

    case READY:
    case NAVIGATE_OPEN_CONVERSATION:
      return null;

    default:
      return state;
  }
};

export default deferredOpenConversation;
