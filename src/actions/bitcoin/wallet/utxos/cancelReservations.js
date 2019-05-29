import { refresh as refreshBalance } from '../balance';
import { save } from './save';

export const BITCOIN_WALLET_UTXOS_CANCEL_RESERVATIONS = 'BITCOIN_WALLET_UTXOS_CANCEL_RESERVATIONS';

const cancelReservation = (txid, index) => {
  return {
    type: BITCOIN_WALLET_UTXOS_CANCEL_RESERVATIONS,
    txid,
    index
  };
};

/**
 * Action to cancel UTXO reservations allowing them to be used in new transactions.
 *
 * @param {Object[]} utxos - Reserved UTXOs to cancel reservations for.
 * @param {string} utxos[].txid - Transaction ID that contains the unspent output.
 * @param {number} utxos[].index - The index of the unspent output in the transaction.
 */
export const cancelReservations = (utxos) => {
  return (dispatch) => {
    utxos.forEach((utxo) => {
      dispatch(cancelReservation(utxo.txid, utxo.index));
    });

    // Persist the change.
    return dispatch(save()).then(() => {
      return dispatch(refreshBalance());
    });
  };
};
