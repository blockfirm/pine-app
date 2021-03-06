import { RECOVERY_KEY_REVEAL, RECOVERY_KEY_HIDE } from '../actions/recoveryKey';

const recoveryKey = (state = {}, action) => {
  switch (action.type) {
    case RECOVERY_KEY_REVEAL:
      return {
        ...state,
        visible: true
      };

    case RECOVERY_KEY_HIDE:
      return {
        ...state,
        visible: false
      };

    default:
      return state;
  }
};

export default recoveryKey;
