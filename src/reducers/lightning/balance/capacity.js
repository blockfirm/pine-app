import * as lightningActions from '../../../actions/paymentServer/lightning';

const capacityReducer = (state = 0, action) => {
  switch (action.type) {
    case lightningActions.PINE_LIGHTNING_GET_BALANCE_SUCCESS:
      return parseInt(action.balance.capacity);

    default:
      return state;
  }
};

export default capacityReducer;
