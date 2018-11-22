import bip21 from 'bip21';
import validateAddress from './validateAddress';

const decodeBitcoinUri = (uri) => {
  let decoded;

  try {
    decoded = bip21.decode(uri);
  } catch {
    return {
      address: undefined,
      amount: undefined
    };
  }

  return {
    address: decoded.address,
    amount: decoded.options.amount
  };
};

/**
 * Parses a string and extracts a valid bitcoin address and amount, if present.
 *
 * @param {string} string - A bitcoin URI (BIP21) or address.
 * @param {string} network - 'mainnet' or 'testnet'.
 *
 * @returns { address, amount } A valid bitcoin address and if available, an amount in BTC.
 */
const getPaymentInfoFromString = (string, network) => {
  let address;
  let amount;

  if (!string || typeof string !== 'string') {
    return;
  }

  // Trim in case the user accidentally also copied some whitespace.
  // eslint-disable-next-line no-param-reassign
  string = string.trim();

  if (string.search(/^bitcoin/i) === 0) {
    // Try to decode the bitcoin URI.
    const decoded = decodeBitcoinUri(string);
    address = decoded.address;
    amount = decoded.amount;
  } else {
    // Assume the string is an address.
    address = string;
  }

  // Validate the address.
  if (!validateAddress(address, network)) {
    return;
  }

  return { address, amount };
};

export default getPaymentInfoFromString;
