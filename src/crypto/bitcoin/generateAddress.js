import bitcoin from 'bitcoinjs-lib';
import bip32 from 'bip32';

const getBitcoinNetwork = (network) => {
  return network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
};

/**
 * Creates an address based on the bip49 standard.
 *
 * @param {object} node - A bip32 node.
 * @param {string} network - 'mainnet' or 'testnet'.
 */
const getAddress = (node, network) => {
  const p2wpkh = bitcoin.payments.p2wpkh({
    pubkey: node.publicKey,
    network: getBitcoinNetwork(network)
  });

  const p2sh = bitcoin.payments.p2sh({
    redeem: p2wpkh,
    network: getBitcoinNetwork(network)
  });

  return p2sh.address;
};

/**
 * Generates a BIP44 path based on the specified parameters.
 *
 * @param {boolean} internal - Whether or not to generate a path for an internal address.
 * @param {number} addressIndex - The index of the address starting at 0.
 */
const getPath = (internal, addressIndex) => {
  const change = internal ? 1 : 0; // 0 = external, 1 = internal change address
  return `${change}/${addressIndex}`;
};

/**
 * Generates an internal or external address for the specified index.
 *
 * @param {string} publicKey - Public key for account to use when deriving the address.
 * @param {string} network - 'mainnet' or 'testnet'.
 * @param {boolean} internal - Whether or not to generate internal addresses (change addresses).
 * @param {number} index - The index of the address to generate, starting at 0.
 *
 * @returns {string} The generated address.
 */
const generateAddress = (publicKey, network, internal, index) => {
  const path = getPath(internal, index);
  const bitcoinNetwork = getBitcoinNetwork(network);
  const node = bip32.fromBase58(publicKey, bitcoinNetwork).derivePath(path);
  const address = getAddress(node, network);

  return address;
};

export default generateAddress;
