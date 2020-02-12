import * as lightningActions from '../../../actions/lightning';

const remoteReducer = (state = 0, action) => {
  switch (action.type) {
    case lightningActions.PINE_LIGHTNING_GET_BALANCE_SUCCESS:
      return parseInt(action.balance.remote);

    default:
      return state;
  }
};

export default remoteReducer;
