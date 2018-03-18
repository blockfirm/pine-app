import * as actions from '../actions';

export default function settings(state = {}, action) {
  switch (action.type) {
    case actions.LOAD_SETTINGS_SUCCESS:
      return { ...action.settings };

    default:
      return state;
  }
}
