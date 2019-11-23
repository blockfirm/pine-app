import bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import bip39 from 'bip39';

const getBitcoinNetwork = (network) => {
  return network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
};

const getPublicKeyFromMnemonic = (mnemonic, network) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const bitcoinNetwork = getBitcoinNetwork(network);
  const masterNode = bip32.fromSeed(seed, bitcoinNetwork);
  const xpub = masterNode.neutered().toBase58();

  return xpub;
};

export default getPublicKeyFromMnemonic;
