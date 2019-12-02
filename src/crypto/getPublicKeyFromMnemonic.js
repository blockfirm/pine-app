import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import { getBitcoinNetwork } from './bitcoin';

const getPublicKeyFromMnemonic = (mnemonic, network) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const bitcoinNetwork = getBitcoinNetwork(network);
  const masterNode = bip32.fromSeed(seed, bitcoinNetwork);
  const xpub = masterNode.neutered().toBase58();

  return xpub;
};

export default getPublicKeyFromMnemonic;
