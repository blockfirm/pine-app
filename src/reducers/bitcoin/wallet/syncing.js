import * as syncActions from '../../../actions/bitcoin/wallet/sync';

const syncingReducer = (state = false, action) => {
  switch (action.type) {
    case syncActions.BITCOIN_WALLET_SYNC_REQUEST:
      return true;

    case syncActions.BITCOIN_WALLET_SYNC_SUCCESS:
    case syncActions.BITCOIN_WALLET_SYNC_FAILURE:
      return false;

    default:
      return state;
  }
};

export default syncingReducer;
