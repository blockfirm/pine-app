import { BITCOIN_WALLET_SYNC_SUCCESS, BITCOIN_WALLET_SYNC_FAILURE } from '../../actions/bitcoin/wallet/sync';
import { NETWORK_SERVER_GET_INFO_SUCCESS, NETWORK_SERVER_GET_INFO_FAILURE } from '../../actions/network/server/getInfo';

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

    case NETWORK_SERVER_GET_INFO_SUCCESS:
      return {
        ...state,
        info: { ...action.info }
      };

    case NETWORK_SERVER_GET_INFO_FAILURE:
      return {
        ...state,
        info: null
      };

    default:
      return state;
  }
};

export default server;
