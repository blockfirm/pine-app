import { NAVIGATE_OPEN_CONVERSATION, READY } from '../../actions/navigate/openConversation';

const openConversation = (state = null, action) => {
  switch (action.type) {
    case NAVIGATE_OPEN_CONVERSATION:
      return action.address;

    case READY:
      return null;

    default:
      return state;
  }
};

export default openConversation;
