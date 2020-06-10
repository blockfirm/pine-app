import {
  PINE_LIGHTNING_SYNC_REQUEST,
  PINE_LIGHTNING_SYNC_FAILURE
} from '../../actions/lightning';

const syncErrorReducer = (state = null, action) => {
  switch (action.type) {
    case PINE_LIGHTNING_SYNC_REQUEST:
      return null;

    case PINE_LIGHTNING_SYNC_FAILURE:
      return action.error;

    default:
      return state;
  }
};

export default syncErrorReducer;
