import config from '../../../config';
import * as settingsActions from '../../../actions/settings';
import * as lightningActions from '../../../actions/lightning';

const getSpendableBalance = (balance) => {
  const { percentCapacityReservedForFees } = config.lightning;
  const pending = Boolean(balance.pending);
  const localBalance = parseInt(balance.local || 0);
  const totalCapacity = parseInt(balance.capacity || 0);
  const spendableBalance = localBalance - (totalCapacity * percentCapacityReservedForFees / 100);

  if (pending) {
    return 0;
  }

  return spendableBalance > 0 ? Math.floor(spendableBalance) : 0;
};

const spendableReducer = (state = 0, action) => {
  switch (action.type) {
    case settingsActions.SETTINGS_LOAD_SUCCESS:
      if (!state && action.settings.lightning.balance && action.settings.lightning.balance.spendable) {
        return parseInt(action.settings.lightning.balance.spendable);
      }

      return state;

    case lightningActions.PINE_LIGHTNING_GET_BALANCE_SUCCESS:
      return getSpendableBalance(action.balance);

    default:
      return state;
  }
};

export default spendableReducer;
