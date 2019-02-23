import * as syncActions from '../actions/sync';

const syncingReducer = (state = false, action) => {
  switch (action.type) {
    case syncActions.SYNC_REQUEST:
      return true;

    case syncActions.SYNC_SUCCESS:
    case syncActions.SYNC_FAILURE:
      return false;

    default:
      return state;
  }
};

export default syncingReducer;
