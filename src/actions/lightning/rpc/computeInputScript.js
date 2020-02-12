import './typeDefs';
import * as bitcoin from 'bitcoinjs-lib';
import getMnemonicByKey from '../../../crypto/getMnemonicByKey';
import mnemonicToSeed from '../../../crypto/mnemonicToSeed';
import tweakKeyPair from '../../../crypto/tweakKeyPair';

import {
  UNIT_BTC,
  UNIT_SATOSHIS,
  convert as convertBitcoin,
  getKeyPairForAddress,
  getBitcoinNetwork
} from '../../../crypto/bitcoin';

const HASH_TYPE_OLD = 0;
const HASH_TYPE_ALL = 1;
const HASH_TYPE_NONE = 2;
const HASH_TYPE_SINGLE = 3;
const HASH_TYPE_ANY_ONE_CAN_PAY = 4;

const SIGHASH_MAP = {
  [HASH_TYPE_OLD]: 0x00,
  [HASH_TYPE_ALL]: bitcoin.Transaction.SIGHASH_ALL,
  [HASH_TYPE_NONE]: bitcoin.Transaction.SIGHASH_NONE,
  [HASH_TYPE_SINGLE]: bitcoin.Transaction.SIGHASH_SINGLE,
  [HASH_TYPE_ANY_ONE_CAN_PAY]: bitcoin.Transaction.SIGHASH_ANYONECANPAY
};

export const PINE_LIGHTNING_RPC_COMPUTE_INPUT_SCRIPT = 'PINE_LIGHTNING_RPC_COMPUTE_INPUT_SCRIPT';

const getMnemonic = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

const getTxIdFromHash = (hash) => {
  return hash.toString('hex').match(/../g).reverse().join('');
};

const findKeyByOutputScript = (outputScript, addresses, seed, network) => {
  const bitcoinNetwork = getBitcoinNetwork(network);
  const address = bitcoin.address.fromOutputScript(outputScript, bitcoinNetwork);

  return getKeyPairForAddress(address, addresses, seed, network);
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

// eslint-disable-next-line max-params
const createTransactionBuilder = (transaction, addresses, utxos, seed, network) => {
  const psbt = new bitcoin.Psbt({ network: getBitcoinNetwork(network) });

  psbt.setVersion(transaction.version);
  psbt.setLocktime(transaction.lockTime);

  transaction.outputs.forEach(output => {
    psbt.addOutput({
      script: output.pkScript,
      value: Number(output.value)
    });
  });

  transaction.inputs.forEach(input => {
    const txid = getTxIdFromHash(input.transactionHash);
    const utxo = getUtxo(utxos, txid, input.index);

    if (!utxo) {
      throw new Error(`No utxo could be found for input #${input.index}`);
    }

    const keyPair = findKeyByOutputScript(utxo.script, addresses, seed, network);
    const redeemScript = getRedeemScript(keyPair, network);

    psbt.addInput({
      hash: input.transactionHash,
      index: input.index,
      sequence: input.sequence,
      witnessUtxo: utxo,
      redeemScript
    });
  });

  return psbt;
};

const getInputScript = (psbt, signDescriptor, tweakedKeyPair) => {
  const { inputIndex, hashType } = signDescriptor;

  psbt.signInput(
    inputIndex,
    tweakedKeyPair,
    [SIGHASH_MAP[hashType]]
  );

  psbt.validateSignaturesOfInput(inputIndex);

  const input = psbt.data.inputs[inputIndex];
  const partialSig = input.partialSig[0];

  const payment = bitcoin.payments.p2wpkh({
    output: input.redeemScript,
    pubkey: partialSig.pubkey,
    signature: partialSig.signature
  });

  const p2sh = bitcoin.payments.p2sh({ redeem: payment });

  return {
    signatureScript: p2sh.input,
    witness: payment.witness
  };
};

/**
 * Action that computes an input script for a transaction (for lightning).
 *
 * @param {Object} request
 * @param {Transaction} request.transaction - Transaction containing input to compute script for.
 * @param {SignDescriptor} request.signDescriptor - Descriptor of key to sign with.
 *
 * @returns {Promise.Object} A promise resolving to an object with the input script.
 */
export const computeInputScript = ({ transaction, signDescriptor }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { network } = state.settings.bitcoin;
    const { addresses } = state.bitcoin.wallet;
    const utxos = state.bitcoin.wallet.utxos.items;

    dispatch({ type: PINE_LIGHTNING_RPC_COMPUTE_INPUT_SCRIPT });

    const mnemonic = await getMnemonic(state.keys.items);
    const seed = mnemonicToSeed(mnemonic);
    const keyPair = findKeyByOutputScript(signDescriptor.output.pkScript, addresses, seed, network);

    if (!keyPair) {
      throw new Error('Could not locate key for computing input script');
    }

    const tweakedKeyPair = tweakKeyPair(keyPair, signDescriptor);
    const psbt = await createTransactionBuilder(transaction, addresses, utxos, seed, network);

    return getInputScript(psbt, signDescriptor, tweakedKeyPair);
  };
};
