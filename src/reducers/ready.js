import { READY, FINALIZE_SETUP_SUCCESS } from '../actions';

const readyReducer = (state = false, action) => {
  switch (action.type) {
    case READY:
    case FINALIZE_SETUP_SUCCESS:
      return true;

    default:
      return state;
  }
};

export default readyReducer;
