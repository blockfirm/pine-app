import * as settingsActions from '../../../actions/settings';
import * as lightningActions from '../../../actions/lightning';

const capacityReducer = (state = 0, action) => {
  switch (action.type) {
    case settingsActions.SETTINGS_LOAD_SUCCESS:
      if (!state && action.settings.lightning.balance && action.settings.lightning.balance.capacity) {
        return parseInt(action.settings.lightning.balance.capacity);
      }

      return state;

    case lightningActions.PINE_LIGHTNING_GET_BALANCE_SUCCESS:
      return parseInt(action.balance.capacity);

    default:
      return state;
  }
};

export default capacityReducer;
