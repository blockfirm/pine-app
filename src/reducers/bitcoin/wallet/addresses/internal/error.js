import * as internalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/internal';

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_REQUEST:
    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_REQUEST:
      return null;

    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_LOAD_FAILURE:
    case internalAddressActions.BITCOIN_WALLET_ADDRESSES_INTERNAL_SAVE_FAILURE:
      return action.error;

    default:
      return state;
  }
};

export default errorReducer;
