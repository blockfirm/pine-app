import * as internalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/internal';
import * as addressActions from '../../../../../actions/bitcoin/wallet/addresses';

const itemsReducer = (state = {}, action) => {
  switch (action.type) {
    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_SUCCESS:
      return action.addresses;

    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS:
      Object.keys(action.addresses).forEach((address) => {
        state[address] = action.addresses[address];
      });

      return state;

    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_REMOVE_ALL_SUCCESS:
      return {};

    case addressActions.BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED:
      action.addresses.forEach((address) => {
        if (address in state) {
          state[address].used = true;
        }
      });

      return state;

    default:
      return state;
  }
};

export default itemsReducer;
