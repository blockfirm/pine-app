import * as settingsActions from '../../../actions/settings';
import * as lightningActions from '../../../actions/lightning';

const localReducer = (state = 0, action) => {
  switch (action.type) {
    case settingsActions.SETTINGS_LOAD_SUCCESS:
      if (!state && action.settings.lightning.balance && action.settings.lightning.balance.local) {
        return parseInt(action.settings.lightning.balance.local);
      }

      return state;

    case lightningActions.PINE_LIGHTNING_GET_BALANCE_SUCCESS:
      return parseInt(action.balance.local);

    default:
      return state;
  }
};

export default localReducer;
