import * as walletActions from '../../../../../actions/bitcoin/wallet';

const unusedReducer = (state = null, action) => {
  switch (action.type) {
    case walletActions.BITCOIN_WALLET_GET_UNUSED_ADDRESS_SUCCESS:
      if (!action.internal) {
        return state;
      }

      return action.address;

    default:
      return state;
  }
};

export default unusedReducer;
