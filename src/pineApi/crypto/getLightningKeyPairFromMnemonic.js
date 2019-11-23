import * as bip32 from 'bip32';
import bip39 from 'bip39';

/**
 * 1017 is the BIP44 purpose code for the Lightning Network.
 * It should only be used for deriving a key pair to be used
 * together with the Lightning Network.
 */
const PURPOSE_CODE_1017 = 1017;

const COIN_TYPE_MAINNET = 0;
const COIN_TYPE_TESTNET = 1;

/**
 * Gets a key pair from a mnemonic to be used with the Lightning Network.
 *
 * @param {string} mnemonic - A 12-word mnemonic separated by space.
 * @param {string} network - 'mainnet' or 'testnet'.
 *
 * @returns {Object} A bitcoinjs key pair that is derived from the BIP44 path "m/1017'/<coinType>'".
 */
const getLightningKeyPairFromMnemonic = (mnemonic, network) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const masterNode = bip32.fromSeed(seed);
  const coinType = network === 'testnet' ? COIN_TYPE_TESTNET : COIN_TYPE_MAINNET;
  const path = `m/${PURPOSE_CODE_1017}'/${coinType}'`;
  const keyPair = masterNode.derivePath(path);

  return keyPair;
};

export default getLightningKeyPairFromMnemonic;
