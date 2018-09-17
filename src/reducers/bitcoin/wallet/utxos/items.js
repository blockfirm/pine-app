import * as utxoActions from '../../../../actions/bitcoin/wallet/utxos';

const itemsReducer = (state = [], action) => {
  switch (action.type) {
    case utxoActions.BITCOIN_WALLET_UTXOS_LOAD_SUCCESS:
    case utxoActions.BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS:
      return action.utxos;

    case utxoActions.BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS:
      return [];

    default:
      return state;
  }
};

export default itemsReducer;
