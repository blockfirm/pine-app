import moment from 'moment-timezone';
import { refresh as refreshBalance } from '../balance';
import { save } from './save';

const EXPIRE_DAYS = 90;

export const BITCOIN_WALLET_UTXOS_RESERVE = 'BITCOIN_WALLET_UTXOS_RESERVE';

const reserveUtxo = (txid, index, expireAt) => {
  return {
    type: BITCOIN_WALLET_UTXOS_RESERVE,
    txid,
    index,
    expireAt
  };
};

/**
 * Action to reserve UTXOs and preventing them from being used
 * in multiple transactions while waiting for a recipient to
 * broadcast a transaction to the network.
 *
 * @param {Object[]} utxos - UTXOs to reserve.
 * @param {string} utxos[].txid - Transaction ID that contains the unspent output.
 * @param {number} utxos[].index - The index of the unspent output in the transaction.
 */
export const reserve = (utxos) => {
  return (dispatch) => {
    // The reservation will expire in 90 days from now.
    const expireAt = moment().add(EXPIRE_DAYS, 'days').unix();

    utxos.forEach((utxo) => {
      dispatch(reserveUtxo(utxo.txid, utxo.index, expireAt));
    });

    // Persist the change.
    return dispatch(save()).then(() => {
      return dispatch(refreshBalance());
    });
  };
};
