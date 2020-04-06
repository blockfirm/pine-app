import * as settingsActions from '../../../actions/settings';
import * as lightningActions from '../../../actions/lightning';

const pendingReducer = (state = 0, action) => {
  switch (action.type) {
    case settingsActions.SETTINGS_LOAD_SUCCESS:
      if (!state && action.settings.lightning.balance && action.settings.lightning.balance.pending) {
        return parseInt(action.settings.lightning.balance.pending);
      }

      return state;

    case lightningActions.PINE_LIGHTNING_GET_BALANCE_SUCCESS:
      if (action.balance.pending) {
        return parseInt(action.balance.local);
      }

      return 0;

    default:
      return state;
  }
};

export default pendingReducer;
