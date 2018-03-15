import * as actions from '../actions';

export default function error(state = null, action) {
  switch (action.type) {
    case actions.HANDLE_ERROR:
      return action.error;

    case actions.DISMISS_ERROR:
      return null;

    default:
      return state;
  }
}
