import { NAVIGATE_OPEN_CONVERSATION, READY } from '../../actions/navigate/openConversation';
import { RESET_SUCCESS } from '../../actions';

const openConversation = (state = null, action) => {
  switch (action.type) {
    case NAVIGATE_OPEN_CONVERSATION:
      return action.address;

    case READY:
    case RESET_SUCCESS:
      return null;

    default:
      return state;
  }
};

export default openConversation;
