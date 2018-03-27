import bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';

export default function getPublicKeyFromMnemonic(mnemonic) {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const masterNode = bitcoin.HDNode.fromSeedBuffer(seed);
  const xpub = masterNode.neutered().toBase58();

  return xpub;
}
