import * as externalAddressActions from '../../../../../actions/bitcoin/wallet/addresses/external';
import * as addressActions from '../../../../../actions/bitcoin/wallet/addresses';

const unusedReducer = (state = null, action) => {
  switch (action.type) {
    case addressActions.BITCOIN_WALLET_ADDRESSES_GET_UNUSED_SUCCESS:
      if (action.internal) {
        return state;
      }

      return action.address;

    case externalAddressActions.BITCOIN_WALLET_ADDRESSES_EXTERNAL_REMOVE_ALL_SUCCESS:
      return null;

    default:
      return state;
  }
};

export default unusedReducer;
