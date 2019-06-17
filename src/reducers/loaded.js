import { LOAD_SUCCESS } from '../actions';

const loadedReducer = (state = false, action) => {
  if (action.type === LOAD_SUCCESS) {
    return true;
  }

  return state;
};

export default loadedReducer;
