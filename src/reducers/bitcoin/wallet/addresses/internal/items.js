import * as internalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/internal';
import * as addressActions from '../../../../../actions/bitcoin/wallet/addresses';

const itemsReducer = (state = {}, action) => {
  let newState;

  switch (action.type) {
    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_SUCCESS:
      return action.addresses;

    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS:
      return {
        ...state,
        ...action.addresses
      };

    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_REMOVE_ALL_SUCCESS:
      return {};

    case addressActions.BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED:
      newState = { ...state };

      action.addresses.forEach((address) => {
        if (address in newState) {
          newState[address].used = true;
        }
      });

      return newState;

    default:
      return state;
  }
};

export default itemsReducer;
