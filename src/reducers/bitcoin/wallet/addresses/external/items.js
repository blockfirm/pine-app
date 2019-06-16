import * as externalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/external';
import * as addressActions from '../../../../../actions/bitcoin/wallet/addresses';

const itemsReducer = (state = {}, action) => {
  switch (action.type) {
    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_SUCCESS:
      return action.addresses;

    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_ADD_SUCCESS:
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

    default:
      return state;
  }
};

export default itemsReducer;
