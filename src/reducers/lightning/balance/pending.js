import * as lightningActions from '../../../actions/paymentServer/lightning';

const pendingReducer = (state = false, action) => {
  switch (action.type) {
    case lightningActions.PINE_LIGHTNING_GET_BALANCE_SUCCESS:
      return Boolean(action.balance.pending);

    default:
      return state;
  }
};

export default pendingReducer;
