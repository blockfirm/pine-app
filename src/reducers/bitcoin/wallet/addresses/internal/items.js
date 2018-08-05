import * as internalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/internal';

const itemsReducer = (state = {}, action) => {
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

    default:
      return state;
  }
};

export default itemsReducer;
