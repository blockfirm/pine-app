import * as keysActions from '../../actions/keys';
import error from './error';
import items from './items';

const keys = (state = {}, action) => {
  switch (action.type) {
    case keysActions.KEYS_ADD_REQUEST:
    case keysActions.KEYS_ADD_SUCCESS:

    case keysActions.KEYS_LOAD_REQUEST:
    case keysActions.KEYS_LOAD_SUCCESS:
    case keysActions.KEYS_LOAD_FAILURE:

    case keysActions.KEYS_REMOVE_REQUEST:
    case keysActions.KEYS_REMOVE_SUCCESS:
    case keysActions.KEYS_REMOVE_FAILURE:

    case keysActions.KEYS_SAVE_REQUEST:
    case keysActions.KEYS_SAVE_SUCCESS:
    case keysActions.KEYS_SAVE_FAILURE:
      return {
        ...state,
        error: error(state.error, action),
        items: items(state.items, action)
      };

    default:
      return state;
  }
};

export default keys;
