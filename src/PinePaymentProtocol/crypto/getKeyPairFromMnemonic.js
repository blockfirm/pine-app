import bip32 from 'bip32';
import bip39 from 'bip39';

const PURPOSE_CODE = 428;

/**
 * Gets a key pair from a mnemonic to be used with the Pine Payment Protocol.
 *
 * @param {string} mnemonic - A 12-word mnemonic.
 *
 * @returns {Object} A bitcoinjs key pair that is derived from the bip32 path "m/428'/{accountIndex}'".
 */
const getKeyPairFromMnemonic = (mnemonic, accountIndex = 0) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const masterNode = bip32.fromSeed(seed);
  const path = `m/${PURPOSE_CODE}'/${accountIndex}'`;
  const keyPair = masterNode.derivePath(path);

  keyPair.compressed = true;

  return keyPair;
};

export default getKeyPairFromMnemonic;
