import bitcoin from 'bitcoinjs-lib';

/**
 * Creates an address based on the bip32 standard.
 *
 * @param {object} node - A bip32 node.
 * @param {string} network - 'mainnet' or 'testnet'.
 */
const getAddress = (node, network) => {
  const p2pkh = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.mainnet
  });

  return p2pkh.address;
};

/**
 * Generates a BIP44 path based on the specified parameters.
 *
 * @param {object} addressInfo - An object describing an address using BIP44.
 * - @param {string} network - 'mainnet' or 'testnet'.
 * - @param {number} accountIndex - The index of the account starting at 0.
 * - @param {boolean} internal - Whether or not to generate a path for an internal address.
 * - @param {number} addressIndex - The index of the address starting at 0.
 */
const getBip44Path = (addressInfo) => {
  const {
    network,
    accountIndex,
    internal,
    addressIndex
  } = addressInfo;

  const purpose = 44; // BIP44
  const coinType = network === 'testnet' ? 1 : 0; // Default to mainnet.
  const change = internal ? 1 : 0; // 0 = external, 1 = internal change address

  return `m/${purpose}'/${coinType}'/${accountIndex}'/${change}/${addressIndex}`;
};

/**
 * Generates a bitcoin address based on `addressInfo`.
 *
 * @param {object} addressInfo - An object describing the address using BIP44.
 * - @param {object} root - A bip32 root from a private key.
 * - @param {string} network - 'mainnet' or 'testnet'.
 * - @param {number} accountIndex - The index of the account to generate the address for.
 * - @param {boolean} internal - Whether or not to generate internal addresses (change addresses).
 * - @param {number} addressIndex - The index of the address to generate, starting at 0.
 */
const generateAddress = (addressInfo) => {
  const path = getBip44Path(addressInfo);
  const child = addressInfo.root.derivePath(path);
  const address = getAddress(child, addressInfo.network);

  return address;
};

export default generateAddress;
