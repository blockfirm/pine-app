import * as utxoActions from '../../../actions/bitcoin/wallet/utxos';

const spendableBalanceReducer = (state = 0, action) => {
  let balance = 0;

  switch (action.type) {
    case utxoActions.BITCOIN_WALLET_UTXOS_LOAD_SUCCESS:
    case utxoActions.BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS:
      /**
       * Calculate the sum of all spendable transaction outputs.
       * That includes all confirmed UTXOs and all unconfirmed
       * internal (change) UTXOs.
       */
      balance = action.utxos.reduce((sum, utxo) => {
        if (utxo.confirmed || utxo.internal) {
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

export default spendableBalanceReducer;
