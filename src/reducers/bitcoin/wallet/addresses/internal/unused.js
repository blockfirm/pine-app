import * as internalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/internal';
import * as addressActions from '../../../../../actions/bitcoin/wallet/addresses';

const unusedReducer = (state = null, action) => {
  switch (action.type) {
    case addressActions.BITCOIN_WALLET_ADDRESSES_GET_UNUSED_SUCCESS:
      if (!action.internal) {
        return state;
      }

      return action.address;

    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_REMOVE_ALL_SUCCESS:
      return null;

    default:
      return state;
  }
};

export default unusedReducer;
