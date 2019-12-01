import { refresh as refreshBalance } from '../balance';
import { save } from './save';

export const BITCOIN_WALLET_UTXOS_UNRESERVE = 'BITCOIN_WALLET_UTXOS_UNRESERVE';

const unreserveUtxo = (txid, index) => {
  return {
    type: BITCOIN_WALLET_UTXOS_UNRESERVE,
    txid,
    index
  };
};

/**
 * Action to unreserve reserved UTXOs.
 *
 * @param {Object[]} utxos - UTXOs to remove reservations for.
 * @param {string} utxos[].txid - Transaction ID that contains the unspent output.
 * @param {number} utxos[].index - The index of the unspent output in the transaction.
 */
export const unreserve = (utxos) => {
  return (dispatch) => {
    utxos.forEach((utxo) => {
      dispatch(unreserveUtxo(utxo.txid, utxo.index));
    });

    // Persist the change.
    return dispatch(save()).then(() => {
      return dispatch(refreshBalance());
    });
  };
};
