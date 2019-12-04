import {
  UNIT_BTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin
} from '../../../../crypto/bitcoin/convert';

export const PINE_LIGHTNING_RPC_FETCH_INPUT_INFO = 'PINE_LIGHTNING_RPC_FETCH_INPUT_INFO';

const ADDRESS_TYPE_NESTED_WITNESS_PUBKEY = 2; // BIP49 (p2sh-p2wpkh)

const getTxIdFromHash = (hash) => {
  return hash.toString('hex').match(/../g).reverse().join('');
};

/**
 * Action that returns a UTXO to be used as an input.
 *
 * @param {Object} request
 * @param {Buffer} request.hash - Hash of the transaction the utxo was created in.
 * @param {Buffer} request.index - The output index of the UTXO.
 *
 * @returns {Promise.Object} A promise resolving to an object with the UTXO.
 */
export const fetchInputInfo = ({ hash, index }) => {
  const txid = getTxIdFromHash(hash);

  return async (dispatch, getState) => {
    const state = getState();
    const utxos = state.bitcoin.wallet.utxos.items;

    dispatch({ type: PINE_LIGHTNING_RPC_FETCH_INPUT_INFO });

    const utxo = utxos.find((output) => (
      output.txid === txid && output.n === index
    ));

    if (!utxo) {
      return { utxo: undefined };
    }

    return {
      utxo: {
        addressType: ADDRESS_TYPE_NESTED_WITNESS_PUBKEY,
        value: convertBitcoin(utxo.value, UNIT_BTC, UNIT_SATOSHIS).toString(),
        confirmations: utxo.confirmations,
        pkScript: Buffer.from(utxo.scriptPubKey.hex, 'hex'),
        transactionHash: hash,
        vout: utxo.n
      }
    };
  };
};
