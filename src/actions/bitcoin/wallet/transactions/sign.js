import * as bitcoin from 'bitcoinjs-lib';
import getMnemonicByKey from '../../../../crypto/getMnemonicByKey';
import getKeyPairForAddress from '../../../../crypto/bitcoin/getKeyPairForAddress';

import {
  UNIT_BTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin
} from '../../../../crypto/bitcoin/convert';

export const BITCOIN_WALLET_TRANSACTIONS_SIGN_REQUEST = 'BITCOIN_WALLET_TRANSACTIONS_SIGN_REQUEST';
export const BITCOIN_WALLET_TRANSACTIONS_SIGN_SUCCESS = 'BITCOIN_WALLET_TRANSACTIONS_SIGN_SUCCESS';
export const BITCOIN_WALLET_TRANSACTIONS_SIGN_FAILURE = 'BITCOIN_WALLET_TRANSACTIONS_SIGN_FAILURE';

const signRequest = () => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_SIGN_REQUEST
  };
};

const signSuccess = (psbt) => {
  return {
    type: BITCOIN_WALLET_TRANSACTIONS_SIGN_SUCCESS,
    psbt
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

const getRedeemScript = (keyPair, network) => {
  const p2wpkh = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network: getBitcoinNetwork(network)
  });

  return p2wpkh.output;
};

const getUtxo = (utxos, txid, index) => {
  const output = utxos.find((utxo) => {
    return utxo.txid === txid && utxo.n === index;
  });

  if (!output) {
    return;
  }

  return {
    script: Buffer.from(output.scriptPubKey.hex, 'hex'),
    value: convertBitcoin(output.value, UNIT_BTC, UNIT_SATOSHIS)
  };
};

const signInputs = (psbt, keyPairs) => {
  keyPairs.forEach((keyPair, index) => {
    psbt.signInput(index, keyPair);

    if (!psbt.validateSignaturesOfInput(index)) {
      throw new Error(`Signature for input #${index} is invalid`);
    }
  });

  psbt.finalizeAllInputs();
};

// eslint-disable-next-line max-params
const signTransaction = (inputs, outputs, addresses, utxos, mnemonic, network) => {
  const bitcoinNetwork = getBitcoinNetwork(network);
  const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });
  const keyPairs = [];

  inputs.forEach((input) => {
    const addressKeys = input.addresses.map((address) => {
      return getKeyPairForAddress(address, addresses, mnemonic, network);
    });

    const keyPair = addressKeys.find(key => key);
    const redeemScript = getRedeemScript(keyPair, network);

    keyPairs.push(keyPair);

    psbt.addInput({
      hash: input.txid,
      index: input.vout,
      witnessUtxo: getUtxo(utxos, input.txid, input.vout),
      redeemScript
    });
  });

  outputs.forEach((output) => {
    psbt.addOutput({
      address: output.address,
      value: output.value
    });
  });

  signInputs(psbt, keyPairs);

  return psbt;
};

const getMnemonic = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

/**
 * Action to sign a transaction.
 *
 * @param {Object[]} inputs - Inputs of the transaction.
 * @param {string} inputs[].txid - ID of the transaction the input was created as an output.
 * @param {number} inputs[].vout - The index of the output in the origin transaction.
 * @param {number} inputs[].value - Input value in satoshis.
 * @param {string[]} inputs[].addresses - List of addresses for the input - used for finding the key.
 * @param {Object[]} outputs - Outputs of the transaction.
 * @param {string} outputs[].address - Address the output should pay to.
 * @param {number} outputs[].value - Output value in satoshis.
 *
 * @returns {Promise.Psbt} Promise that resolves to a bitcoinjs.Psbt instance.
 */
export const sign = (inputs, outputs) => {
  return (dispatch, getState) => {
    const state = getState();
    const { network } = state.settings.bitcoin;
    const { addresses } = state.bitcoin.wallet;
    const utxos = state.bitcoin.wallet.utxos.items;

    dispatch(signRequest());

    return getMnemonic(state.keys.items)
      .then((mnemonic) => {
        const psbt = signTransaction(inputs, outputs, addresses, utxos, mnemonic, network);
        dispatch(signSuccess(psbt));
        return psbt;
      })
      .catch((error) => {
        dispatch(signFailure(error));
        throw error;
      });
  };
};
