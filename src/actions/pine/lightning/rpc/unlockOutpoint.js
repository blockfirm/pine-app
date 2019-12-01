import { unreserve as unreserveUtxos } from '../../../bitcoin/wallet/utxos';

export const PINE_LIGHTNING_RPC_UNLOCK_OUTPOINT = 'PINE_LIGHTNING_RPC_UNLOCK_OUTPOINT';

const getTxIdFromHash = (hash) => {
  return hash.hexSlice().match(/../g).reverse().join('');
};

/**
 * Action that removes a reservation of a utxo.
 *
 * @param {Object} request
 * @param {string} request.hash - Hash of transaction containing the utxo.
 * @param {string} request.index - Transaction output index of the utxo.
 *
 * @returns {Promise.Object} A promise that resolves when the utxo reservation has been removed.
 */
export const unlockOutpoint = ({ hash, index }) => {
  const txid = getTxIdFromHash(hash);

  return async (dispatch) => {
    dispatch({ type: PINE_LIGHTNING_RPC_UNLOCK_OUTPOINT });
    await dispatch(unreserveUtxos([{ txid, index }]));
    return {};
  };
};
