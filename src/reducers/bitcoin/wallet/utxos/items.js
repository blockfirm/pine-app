import * as utxoActions from '../../../../actions/bitcoin/wallet/utxos';

const itemsReducer = (state = [], action) => {
  switch (action.type) {
    case utxoActions.BITCOIN_WALLET_UTXOS_LOAD_SUCCESS:
    case utxoActions.BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS:
      return action.utxos;

    case utxoActions.BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS:
      return [];

    case utxoActions.BITCOIN_WALLET_UTXOS_RESERVE:
      return state.map((utxo) => {
        if (utxo.txid === action.txid && utxo.n === action.index) {
          return {
            ...utxo,
            reserved: true,
            reservedBtcAmount: action.btcAmountToReserve,
            reservationExpiresAt: action.expireAt
          };
        }

        return utxo;
      });

    default:
      return state;
  }
};

export default itemsReducer;
