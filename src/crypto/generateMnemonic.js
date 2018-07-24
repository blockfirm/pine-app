import bip39 from 'bip39';
import getRandomBytes from './getRandomBytes';

const ENTROPY = 128; // 128-bit entropy equals 12 mnemonic words.

const generateMnemonic = () => {
  /*
   * This function first generates the random bytes and then passes
   * them to the bip39.generateMnemonic method. The reason for this
   * is that bip39.generateMnemonic otherwise calls randomBytes
   * synchronously which then won't use iOS's SecRandomCopyBytes.
   */
  return getRandomBytes(ENTROPY / 8).then((bytes) => {
    const randomBytesFunction = () => bytes;
    const wordlist = bip39.english;
    const mnemonic = bip39.generateMnemonic(ENTROPY, randomBytesFunction, wordlist);

    return mnemonic;
  });
};

export default generateMnemonic;
