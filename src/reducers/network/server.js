import { BITCOIN_WALLET_SYNC_SUCCESS, BITCOIN_WALLET_SYNC_FAILURE } from '../../actions/bitcoin/wallet/sync';

const server = (state = {}, action) => {
  switch (action.type) {
    case BITCOIN_WALLET_SYNC_SUCCESS:
      return {
        ...state,
        disconnected: false
      };

    case BITCOIN_WALLET_SYNC_FAILURE:
      return {
        ...state,
        disconnected: true
      };

    default:
      return state;
  }
};

export default server;
