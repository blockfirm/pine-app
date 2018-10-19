import * as addressActions from '../../../../../actions/bitcoin/wallet/addresses';

const unusedReducer = (state = null, action) => {
  switch (action.type) {
    case addressActions.BITCOIN_WALLET_ADDRESSES_GET_UNUSED_SUCCESS:
      if (!action.internal) {
        return state;
      }

      return action.address;

    default:
      return state;
  }
};

export default unusedReducer;
