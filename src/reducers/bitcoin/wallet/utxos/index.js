import * as utxoActions from '../../../../actions/bitcoin/wallet/utxos';
import error from './error';
import items from './items';

const utxosReducer = (state = {}, action) => {
  switch (action.type) {
    case utxoActions.BITCOIN_WALLET_UTXOS_LOAD_REQUEST:
    case utxoActions.BITCOIN_WALLET_UTXOS_LOAD_SUCCESS:
    case utxoActions.BITCOIN_WALLET_UTXOS_LOAD_FAILURE:

    case utxoActions.BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS:

    case utxoActions.BITCOIN_WALLET_UTXOS_SAVE_REQUEST:
    case utxoActions.BITCOIN_WALLET_UTXOS_SAVE_SUCCESS:
    case utxoActions.BITCOIN_WALLET_UTXOS_SAVE_FAILURE:

    case utxoActions.BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS:
      return {
        ...state,
        error: error(state.error, action),
        items: items(state.items, action)
      };

    default:
      return state;
  }
};

export default utxosReducer;
