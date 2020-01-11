import * as bip32 from 'bip32';
import { getBitcoinNetwork } from './bitcoin';
import mnemonicToSeed from './mnemonicToSeed';

const getPublicKeyFromMnemonic = (mnemonic, network) => {
  const seed = mnemonicToSeed(mnemonic);
  const bitcoinNetwork = getBitcoinNetwork(network);
  const masterNode = bip32.fromSeed(seed, bitcoinNetwork);
  const xpub = masterNode.neutered().toBase58();

  return xpub;
};

export default getPublicKeyFromMnemonic;
