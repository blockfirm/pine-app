import * as keysActions from '../../actions/keys';

const error = (state = null, action) => {
  switch (action.type) {
    case keysActions.KEYS_ADD_REQUEST:
    case keysActions.KEYS_LOAD_REQUEST:
    case keysActions.KEYS_REMOVE_REQUEST:
    case keysActions.KEYS_SAVE_REQUEST:
      return null;

    case keysActions.KEYS_LOAD_FAILURE:
    case keysActions.KEYS_REMOVE_FAILURE:
    case keysActions.KEYS_SAVE_FAILURE:
      return action.error;

    default:
      return state;
  }
};

export default error;
