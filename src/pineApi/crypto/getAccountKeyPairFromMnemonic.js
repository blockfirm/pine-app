import bip32 from 'bip32';
import bip39 from 'bip39';

/**
 * 428 is the BIP44 purpose code for the Pine Payment Protocol.
 * It should only be used for deriving a key pair to be used
 * together with the Pine Payment Protocol.
 */
const PURPOSE_CODE_428 = 428;

/**
 * Gets a key pair from a mnemonic and account index to be used with
 * the Pine Payment Protocol.
 *
 * @param {string} mnemonic - A 12-word mnemonic separated by space.
 * @param {number} [accountIndex] - Account index to get key pair for (default 0).
 *
 * @returns {Object} A bitcoinjs key pair that is derived from the bip32 path "m/428'/{accountIndex}'".
 */
const getAccountKeyPairFromMnemonic = (mnemonic, accountIndex = 0) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const masterNode = bip32.fromSeed(seed);
  const path = `m/${PURPOSE_CODE_428}'/${accountIndex}'`;
  const keyPair = masterNode.derivePath(path);

  keyPair.compressed = true;

  return keyPair;
};

export default getAccountKeyPairFromMnemonic;
