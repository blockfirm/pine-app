import * as settingsActions from '../../../actions/settings';
import * as lightningActions from '../../../actions/lightning';

const pendingReducer = (state = false, action) => {
  switch (action.type) {
    case settingsActions.SETTINGS_LOAD_SUCCESS:
      if (action.settings.lightning.balance) {
        return Boolean(action.settings.lightning.balance.pending);
      }

      return state;

    case lightningActions.PINE_LIGHTNING_GET_BALANCE_SUCCESS:
      return Boolean(action.balance.pending);

    default:
      return state;
  }
};

export default pendingReducer;
