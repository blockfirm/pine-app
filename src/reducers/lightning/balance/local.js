import * as lightningActions from '../../../actions/paymentServer/lightning';

const localReducer = (state = 0, action) => {
  switch (action.type) {
    case lightningActions.PINE_LIGHTNING_GET_BALANCE_SUCCESS:
      return parseInt(action.balance.local);

    default:
      return state;
  }
};

export default localReducer;
