import * as errorActions from '../actions/error';

export default function error(state = null, action) {
  switch (action.type) {
    case errorActions.ERROR_HANDLE:
      return action.error;

    case errorActions.ERROR_DISMISS:
      return null;

    default:
      return state;
  }
}
