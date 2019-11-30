import {
  UNIT_BTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin
} from '../../../../crypto/bitcoin/convert';

export const PINE_LIGHTNING_RPC_LIST_UNSPENT_WITNESS = 'PINE_LIGHTNING_RPC_LIST_UNSPENT_WITNESS';

const ADDRESS_TYPE_NESTED_WITNESS_PUBKEY = 2; // BIP49 (p2sh-p2wpkh)

const getHashFromTxId = (txid) => {
  const hash = Buffer.from(txid, 'hex')
    .hexSlice()
    .match(/../g)
    .reverse()
    .join('');

  return Buffer.from(hash, 'hex');
};

/**
 * Action that returns a list of unspent transaction outputs (utxos).
 *
 * @param {Object} request
 * @param {string} request.minConfirmations - Minimum confirmations the utxo must have.
 * @param {string} request.maxConfirmations - Maximum confirmations the utxo must have (ignored).
 *
 * @returns {Promise.Object[]} A promise resolving to a list of utxos.
 */
export const listUnspentWitness = ({ minConfirmations }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const utxos = state.bitcoin.wallet.utxos.items;

    dispatch({ type: PINE_LIGHTNING_RPC_LIST_UNSPENT_WITNESS });

    const filteredUtxos = utxos
      .filter((utxo) => {
        return !utxo.reserved && utxo.confirmations >= minConfirmations;
      })
      .map((utxo) => ({
        addressType: ADDRESS_TYPE_NESTED_WITNESS_PUBKEY,
        value: convertBitcoin(utxo.value, UNIT_BTC, UNIT_SATOSHIS).toString(),
        confirmations: utxo.confirmations,
        pkScript: Buffer.from(utxo.scriptPubKey.hex, 'hex'),
        transactionHash: getHashFromTxId(utxo.txid),
        vout: utxo.n
      }));

    return { utxos: filteredUtxos };
  };
};
