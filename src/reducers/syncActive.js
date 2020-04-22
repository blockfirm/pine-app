import { INACTIVATE_SYNC, REACTIVATE_SYNC } from '../actions';

const syncActiveReducer = (state = true, action) => {
  switch (action.type) {
    case INACTIVATE_SYNC:
      return false;

    case REACTIVATE_SYNC:
      return true;

    default:
      return state;
  }
};

export default syncActiveReducer;
