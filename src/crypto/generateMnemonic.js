import bip39 from 'bip39';
import randomBytes from './randomBytes';

const ENTROPY = 128; // 128-bit entropy equals 12 mnemonic words.

export default function generateMnemonic() {
  return randomBytes(ENTROPY / 8).then((bytes) => {
    const getRandomBytes = () => bytes;
    const wordlist = bip39.english;
    const mnemonic = bip39.generateMnemonic(ENTROPY, getRandomBytes, wordlist);

    return mnemonic;
  });
}
