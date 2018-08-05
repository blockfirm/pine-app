import * as externalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/external';

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_REQUEST:
    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_SAVE_REQUEST:
      return null;

    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_FAILURE:
    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_SAVE_FAILURE:
      return action.error;

    default:
      return state;
  }
};

export default errorReducer;
