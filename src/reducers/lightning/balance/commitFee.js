import * as settingsActions from '../../../actions/settings';
import * as lightningActions from '../../../actions/lightning';

const commitFeeReducer = (state = 0, action) => {
  switch (action.type) {
    case settingsActions.SETTINGS_LOAD_SUCCESS:
      if (!state && action.settings.lightning.balance && action.settings.lightning.balance.commitFee) {
        return parseInt(action.settings.lightning.balance.commitFee);
      }

      return state;

    case lightningActions.PINE_LIGHTNING_GET_BALANCE_SUCCESS:
      return parseInt(action.balance.commitFee);

    default:
      return state;
  }
};

export default commitFeeReducer;
