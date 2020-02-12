import * as lightningActions from '../../../actions/lightning';

const commitFeeReducer = (state = 0, action) => {
  switch (action.type) {
    case lightningActions.PINE_LIGHTNING_GET_BALANCE_SUCCESS:
      return parseInt(action.balance.commitFee);

    default:
      return state;
  }
};

export default commitFeeReducer;
