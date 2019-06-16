import normalizeBtcAmount from '../../../crypto/bitcoin/normalizeBtcAmount';
import * as balanceActions from '../../../actions/bitcoin/wallet/balance';
import * as utxoActions from '../../../actions/bitcoin/wallet/utxos';

const spendableBalanceReducer = (state = 0, action) => {
  let balance = 0;

  switch (action.type) {
    case balanceActions.BITCOIN_WALLET_BALANCE_REFRESH:
    case utxoActions.BITCOIN_WALLET_UTXOS_LOAD_SUCCESS:
    case utxoActions.BITCOIN_WALLET_UTXOS_UPDATE_SUCCESS:
      /**
       * Calculate the sum of all spendable transaction outputs.
       * That includes all confirmed UTXOs and all unconfirmed
       * internal (change) UTXOs that has not been reserved.
       */
      balance = action.utxos.reduce((sum, utxo) => {
        if ((utxo.confirmed || utxo.internal) && !utxo.reserved) {
          return normalizeBtcAmount(sum + utxo.value);
        }

        return sum;
      }, 0);

      return balance;

    default:
      return state;
  }
};

export default spendableBalanceReducer;
