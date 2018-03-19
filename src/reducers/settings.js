import * as settingsActions from '../actions/settings';

export default function settings(state = {}, action) {
  switch (action.type) {
    case settingsActions.SETTINGS_LOAD_SUCCESS:
      return { ...action.settings };

    default:
      return state;
  }
}
