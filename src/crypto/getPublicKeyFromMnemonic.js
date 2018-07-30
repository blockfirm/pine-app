import bip32 from 'bip32';
import bip39 from 'bip39';

const getPublicKeyFromMnemonic = (mnemonic) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const masterNode = bip32.fromSeed(seed);
  const xpub = masterNode.neutered().toBase58();

  return xpub;
};

export default getPublicKeyFromMnemonic;
