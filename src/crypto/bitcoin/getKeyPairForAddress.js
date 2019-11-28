import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';

const getBitcoinNetwork = (network) => {
  return network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
};

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

const getKeyPairForAddress = (address, addresses, mnemonic, network) => {
  const { addressIndex, internal } = getAddressIndex(address, addresses);

  if (addressIndex === undefined) {
    return;
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);
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
