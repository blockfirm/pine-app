import * as settingsActions from '../actions/settings';

const settings = (state = {}, action) => {
  switch (action.type) {
    case settingsActions.SETTINGS_LOAD_SUCCESS:
      return { ...action.settings };

    default:
      return state;
  }
};

export default settings;
