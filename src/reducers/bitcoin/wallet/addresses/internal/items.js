import * as internalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/internal';
import * as addressActions from '../../../../../actions/bitcoin/wallet/addresses';
import * as lightningRpcActions from '../../../../../actions/lightning/rpc';

const itemsReducer = (state = {}, action) => {
  switch (action.type) {
    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_SUCCESS:
      return action.addresses;

    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS:
      Object.keys(action.addresses).forEach((address) => {
        state[address] = action.addresses[address];
      });

      return state;

    case addressActions.BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED:
      action.addresses.forEach((address) => {
        if (address in state) {
          state[address] = {
            ...state[address],
            used: true
          };
        }
      });

      return state;

    case lightningRpcActions.PINE_LIGHTNING_RPC_NEW_ADDRESS:
      if (action.address in state) {
        state[action.address] = {
          ...state[action.address],
          lightning: true
        };
      }

      return state;

    default:
      return state;
  }
};

export default itemsReducer;
