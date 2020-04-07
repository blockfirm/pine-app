import { PINE_LIGHTNING_SYNC_SUCCESS, PINE_LIGHTNING_SYNC_FAILURE } from '../../actions/lightning';

const lightning = (state = {}, action) => {
  switch (action.type) {
    case PINE_LIGHTNING_SYNC_SUCCESS:
      return {
        ...state,
        disconnected: false
      };

    case PINE_LIGHTNING_SYNC_FAILURE:
      return {
        ...state,
        disconnected: true
      };

    default:
      return state;
  }
};

export default lightning;
