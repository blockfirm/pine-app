import * as externalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/external';
import error from './error';
import items from './items';

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
      return {
        ...state,
        error: error(state.error, action),
        items: items(state.items, action)
      };

    default:
      return state;
  }
};

export default externalReducer;
