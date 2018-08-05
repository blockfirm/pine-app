import * as externalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/external';

const itemsReducer = (state = {}, action) => {
  switch (action.type) {
    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_LOAD_SUCCESS:
      return action.addresses;

    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_ADD_SUCCESS:
      return {
        ...state,
        ...action.addresses
      };

    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_REMOVE_ALL_SUCCESS:
      return {};

    default:
      return state;
  }
};

export default itemsReducer;
