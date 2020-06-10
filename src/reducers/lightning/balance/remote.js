import * as settingsActions from '../../../actions/settings';
import * as lightningActions from '../../../actions/lightning';

const remoteReducer = (state = 0, action) => {
  switch (action.type) {
    case settingsActions.SETTINGS_LOAD_SUCCESS:
      if (!state && action.settings.lightning.balance && action.settings.lightning.balance.remote) {
        return parseInt(action.settings.lightning.balance.remote);
      }

      return state;

    case lightningActions.PINE_LIGHTNING_GET_BALANCE_SUCCESS:
      return parseInt(action.balance.remote);

    default:
      return state;
  }
};

export default remoteReducer;
