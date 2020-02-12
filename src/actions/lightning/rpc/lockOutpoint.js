import { reserve as reserveUtxos } from '../../bitcoin/wallet/utxos';

export const PINE_LIGHTNING_RPC_LOCK_OUTPOINT = 'PINE_LIGHTNING_RPC_LOCK_OUTPOINT';

const EXPIRATION_TIME = 10 * 60; // 10 minutes.

const getTxIdFromHash = (hash) => {
  return hash.toString('hex').match(/../g).reverse().join('');
};

/**
 * Action that reserves a utxo while it's being used to open a new
 * lightning channel.
 *
 * @param {Object} request
 * @param {string} request.hash - Hash of transaction containing the utxo.
 * @param {string} request.index - Transaction output index of the utxo.
 *
 * @returns {Promise.Object} A promise that resolves when the utxo has been reserved.
 */
export const lockOutpoint = ({ hash, index }) => {
  const txid = getTxIdFromHash(hash);
  const expireAt = Date.now() / 1000 + EXPIRATION_TIME;

  return async (dispatch) => {
    dispatch({ type: PINE_LIGHTNING_RPC_LOCK_OUTPOINT });
    await dispatch(reserveUtxos([{ txid, index }], 0, expireAt));
    return {};
  };
};
