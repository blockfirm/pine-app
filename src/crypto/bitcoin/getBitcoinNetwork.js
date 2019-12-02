import * as bitcoin from 'bitcoinjs-lib';

/**
 * Returns a bitcoinjs network for the passed network.
 *
 * @param {string} network - 'mainnet', 'testnet', or 'regtest'.
 *
 * @returns {Network} bitcoinjs Network.
 */
const getBitcoinNetwork = (network) => {
  switch (network) {
    case 'regtest': return bitcoin.networks.regtest;
    case 'testnet': return bitcoin.networks.testnet;
    default: return bitcoin.networks.bitcoin;
  }
};

export default getBitcoinNetwork;
