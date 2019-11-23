import bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import bip39 from 'bip39';
import getMnemonicByKey from '../../../../crypto/getMnemonicByKey';

export const BITCOIN_WALLET_TRANSACTIONS_SIGN_REQUEST = 'BITCOIN_WALLET_TRANSACTIONS_SIGN_REQUEST';
export const BITCOIN_WALLET_TRANSACTIONS_SIGN_SUCCESS = 'BITCOIN_WALLET_TRANSACTIONS_SIGN_SUCCESS';
export const BITCOIN_WALLET_TRANSACTIONS_SIGN_FAILURE = 'BITCOIN_WALLET_TRANSACTIONS_SIGN_FAILURE';

const signRequest = () => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_SIGN_REQUEST
  };
};

const signSuccess = () => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_SIGN_SUCCESS
  };
};

const signFailure = (error) => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_SIGN_FAILURE,
    error
  };
};

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

  const seed = bip39.mnemonicToSeed(mnemonic);
  const masterNode = bip32.fromSeed(seed, getBitcoinNetwork(network));

  const purpose = 49; // BIP49
  const coinType = network === 'testnet' ? 1 : 0; // Default to mainnet.
  const accountIndex = 0;
  const change = Number(internal); // 0 = external, 1 = internal change address
  const path = `m/${purpose}'/${coinType}'/${accountIndex}'/${change}/${addressIndex}`;
  const node = masterNode.derivePath(path);

  return node;
};

const getRedeemScript = (keyPair, network) => {
  const p2wpkh = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network: getBitcoinNetwork(network)
  });

  return p2wpkh.output;
};

// eslint-disable-next-line max-params
const signInputs = (transaction, inputs, addresses, mnemonic, network) => {
  inputs.forEach((input, index) => {
    const addressKeys = input.addresses.map((address) => {
      return getKeyPairForAddress(address, addresses, mnemonic, network);
    });

    const keyPair = addressKeys.find(key => key);
    const redeemScript = getRedeemScript(keyPair, network);

    transaction.sign(index, keyPair, redeemScript, null, input.value);
  });

  transaction.signed = true;
};

const getMnemonic = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * Action to sign a transaction.
 *
 * @param {TransactionBuilder} transaction - bitcoinjs TransactionBuilder instance to sign.
 * @param {Object[]} inputs - Inputs of the transaction.
 * @param {string} inputs[].txid - ID of the transaction the input was created as an output.
 * @param {number} inputs[].vout - The index of the output in the origin transaction.
 * @param {number} inputs[].value - Value in satoshies.
 * @param {string[]} inputs[].addresses - List of addresses for the input - used for finding the key.
 *
 * @returns Promise that resolves when the transaction has been signed.
 */
export const sign = (transaction, inputs) => {
  return (dispatch, getState) => {
    const state = getState();
    const { network } = state.settings.bitcoin;
    const { addresses } = state.bitcoin.wallet;

    dispatch(signRequest());

    if (transaction.signed) {
      dispatch(signSuccess());
      return Promise.resolve();
    }

    return getMnemonic(state.keys.items)
      .then((mnemonic) => {
        signInputs(transaction, inputs, addresses, mnemonic, network);
        dispatch(signSuccess());
      })
      .catch((error) => {
        dispatch(signFailure(error));
        throw error;
      });
  };
};
