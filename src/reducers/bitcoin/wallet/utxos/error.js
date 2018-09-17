import * as utxoActions from '../../../../actions/bitcoin/wallet/utxos';

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case utxoActions.BITCOIN_WALLET_UTXOS_LOAD_REQUEST:
    case utxoActions.BITCOIN_WALLET_UTXOS_SAVE_REQUEST:
      return null;

    case utxoActions.BITCOIN_WALLET_UTXOS_LOAD_FAILURE:
    case utxoActions.BITCOIN_WALLET_UTXOS_SAVE_FAILURE:
      return action.error;

    default:
      return state;
  }
};

export default errorReducer;
