import * as bitcoin from 'bitcoinjs-lib';
import getBitcoinNetwork from './getBitcoinNetwork';

/**
 * Validates a bitcoin address.
 *
 * @param {string} address - Bitcoin address to validate.
 * @param {string} network - 'mainnet' or 'testnet'.
 *
 * @returns {boolean} Whether or not the address is valid.
 */
const validateAddress = (address, network) => {
  const bitcoinNetwork = getBitcoinNetwork(network);

  try {
    bitcoin.address.toOutputScript(address, bitcoinNetwork);
    return true;
  } catch {
    return false;
  }
};

export default validateAddress;
