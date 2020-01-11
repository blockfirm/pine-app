import * as bip32 from 'bip32';
import getBitcoinNetwork from './getBitcoinNetwork';
import mnemonicToSeed from '../mnemonicToSeed';

const getAddressIndex = (address, addresses) => {
  const externalAddresses = addresses.external.items;
  const internalAddresses = addresses.internal.items;

  if (address in externalAddresses) {
    return {
      addressIndex: externalAddresses[address].index,
      internal: false
    };
  }

  if (address in internalAddresses) {
    return {
      addressIndex: internalAddresses[address].index,
      internal: true
    };
  }

  return {};
};

/**
 * Gets the key pair that was used to derive the specified BIP49 address.
 *
 * @param {string} address - Bitcoin address to get key pair for.
 * @param {Object} addresses - All bitcoin addresses from state.
 * @param {Object} addresses.external - All external bitcoin addresses from state.
 * @param {Object} addresses.external.items - Map of bitcoin addresses.
 * @param {Object} addresses.internal - All internal bitcoin addresses from state.
 * @param {Object} addresses.internal.items - Map of bitcoin addresses.
 * @param {string} mnemonic - The BIP39 mnemonic as 12 words separated by space.
 * @param {string} network - Bitcoin network of the address, 'testnet' or 'mainnet' (default).
 *
 * @returns {Object} A bitcoinjs key pair.
 */
const getKeyPairForAddress = (address, addresses, mnemonic, network) => {
  const { addressIndex, internal } = getAddressIndex(address, addresses);

  if (addressIndex === undefined) {
    return;
  }

  const seed = mnemonicToSeed(mnemonic);
  const masterNode = bip32.fromSeed(seed, getBitcoinNetwork(network));

  const purpose = 49; // BIP49
  const coinType = network === 'testnet' ? 1 : 0; // Default to mainnet.
  const accountIndex = 0;
  const change = Number(internal); // 0 = external, 1 = internal change address
  const path = `m/${purpose}'/${coinType}'/${accountIndex}'/${change}/${addressIndex}`;
  const node = masterNode.derivePath(path);

  return node;
};

export default getKeyPairForAddress;
