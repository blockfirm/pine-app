import * as bip39 from 'bip39';

/**
 * Converts a 12-word BIP39 mnemonic string into a BIP39 seed.
 *
 * @param {string} mnemonic - The BIP39 mnemonic as 12 words separated by space.
 *
 * @returns {Buffer} A BIP39 seed.
 */
const mnemonicToSeed = (mnemonic) => {
  return bip39.mnemonicToSeedSync(mnemonic);
};

export default mnemonicToSeed;
