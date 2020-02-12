import * as bitcoin from 'bitcoinjs-lib';
import secp256k1 from 'secp256k1';

import getMnemonicByKey from '../../../crypto/getMnemonicByKey';
import { getLightningKeyPairFromMnemonic } from '../../../clients/paymentServer/crypto';

export const PINE_LIGHTNING_RPC_SIGN_MESSAGE = 'PINE_LIGHTNING_RPC_SIGN_MESSAGE';

const KEY_FAMILY = 0;
const KEY_SCAN_LIMIT = 20;

const getMnemonic = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * Finds a private key for the passed public key.
 *
 * TODO: Optimize this by e.g. creating an index that maps
 * public keys to their key derivation index.
 */
const findKeyByPublicKey = (publicKey, mnemonic, network) => {
  const lightningKeyPair = getLightningKeyPairFromMnemonic(mnemonic, network);

  for (let i = 0; i < KEY_SCAN_LIMIT; i++) {
    const keyPair = lightningKeyPair.derivePath(`${KEY_FAMILY}/0/${i}`);
    const keyPairPublic = secp256k1.publicKeyCreate(keyPair.privateKey, false);

    if (keyPairPublic.equals(publicKey)) {
      return keyPair;
    }
  }
};

/**
 * Action that signs a message to be sent over the lightning network.
 *
 * @param {Object} request
 * @param {Buffer} request.message - Message to sign.
 * @param {Buffer} request.publicKey - Public key of the private key to sign with (65 bytes uncompressed).
 *
 * @returns {Promise.Object} A promise resolving to an object with a signature.
 */
export const signMessage = ({ message, publicKey }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { network } = state.settings.bitcoin;

    dispatch({ type: PINE_LIGHTNING_RPC_SIGN_MESSAGE });

    const mnemonic = await getMnemonic(state.keys.items);
    const keyPair = findKeyByPublicKey(publicKey, mnemonic, network);

    if (!keyPair) {
      throw new Error('No private key found for specified public key');
    }

    const hash = bitcoin.crypto.hash256(message);
    const signature = keyPair.sign(hash);
    const derSignature = bitcoin.script.signature.encode(signature, 0x01);

    // Chop off the sighash flag at the end of the signature.
    const finalSignature = derSignature.slice(0, derSignature.length - 1);

    return { signature: finalSignature };
  };
};
