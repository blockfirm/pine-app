import { READY, FINALIZE_SETUP_SUCCESS, RESET_SUCCESS } from '../actions';

const readyReducer = (state = false, action) => {
  switch (action.type) {
    case READY:
    case FINALIZE_SETUP_SUCCESS:
      return true;

    case RESET_SUCCESS:
      return false;

    default:
      return state;
  }
};

export default readyReducer;
