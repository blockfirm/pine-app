import * as utxoActions from '../../../actions/bitcoin/wallet/utxos';

const confirmedBalanceReducer = (state = 0, action) => {
  let balance = 0;

  switch (action.type) {
    case utxoActions.BITCOIN_WALLET_UTXOS_LOAD_SUCCESS:
    case utxoActions.BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS:
      // Calculate the sum of all confirmed unspent transaction outputs.
      balance = action.utxos.reduce((sum, utxo) => {
        if (utxo.confirmed) {
          return sum + utxo.value;
        }

        return sum;
      }, 0);

      return balance;

    case utxoActions.BITCOIN_WALLET_UTXOS_REMOVE_ALL_SUCCESS:
      return 0;

    default:
      return state;
  }
};

export default confirmedBalanceReducer;
