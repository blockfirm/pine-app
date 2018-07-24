import * as keysActions from '../../actions/keys';

const items = (state = {}, action) => {
  let newState;
  let key;

  switch (action.type) {
    case keysActions.KEYS_LOAD_SUCCESS:
      return action.keys;

    case keysActions.KEYS_ADD_SUCCESS:
      key = { ...action.key };

      return {
        ...state,
        [action.key.id]: key
      };

    case keysActions.KEYS_REMOVE_SUCCESS:
      newState = { ...state };
      delete newState[action.key.id];
      return newState;

    default:
      return state;
  }
};

export default items;
