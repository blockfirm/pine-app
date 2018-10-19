import * as externalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/external';
import * as addressActions from '../../../../../actions/bitcoin/wallet/addresses';
import error from './error';
import items from './items';
import unused from './unused';

const externalReducer = (state = {}, action) => {
  switch (action.type) {
    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_ADD_SUCCESS:

    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_REQUEST:
    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_SUCCESS:
    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_FAILURE:

    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_REMOVE_ALL_SUCCESS:

    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_SAVE_REQUEST:
    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_SAVE_SUCCESS:
    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_SAVE_FAILURE:

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

export default externalReducer;
