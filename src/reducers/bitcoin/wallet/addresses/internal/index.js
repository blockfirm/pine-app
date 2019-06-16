import * as internalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/internal';
import * as addressActions from '../../../../../actions/bitcoin/wallet/addresses';
import error from './error';
import items from './items';
import unused from './unused';

const internalReducer = (state = {}, action) => {
  switch (action.type) {
    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_ADD_SUCCESS:

    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_REQUEST:
    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_SUCCESS:
    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_FAILURE:

    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_REQUEST:
    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_SUCCESS:
    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_FAILURE:

    case addressActions.BITCOIN_WALLET_ADDRESSES_GET_UNUSED_SUCCESS:
    case addressActions.BITCOIN_WALLET_ADDRESSES_FLAG_AS_USED:
      return {
        ...state,
        error: error(state.error, action),
        items: items(state.items, action),
        unused: unused(state.unused, action)
      };

    default:
      return state;
  }
};

export default internalReducer;
