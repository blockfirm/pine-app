/* eslint-disable max-lines */
import './typeDefs';
import * as bitcoin from 'bitcoinjs-lib';

import tweakKeyPair from '../../../../crypto/tweakKeyPair';
import getMnemonicByKey from '../../../../crypto/getMnemonicByKey';
import { getLightningKeyPairFromMnemonic } from '../../../../pineApi/crypto';

const MAX_UINT16 = 65535;
const MAX_UINT32 = 4294967295;

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

const OP_DATA_20 = 0x14;

export const PINE_LIGHTNING_RPC_SIGN_OUTPUT_RAW = 'PINE_LIGHTNING_RPC_SIGN_OUTPUT_RAW';

const writeBigUInt64LE = (buffer, int, offset = 0) => {
  let position = offset;
  let value = int;

  while (position < offset + 8) {
    buffer[position++] = value & 255;
    value /= 256;
  }
};

const getMnemonic = (keys) => {
  const defaultKey = Object.values(keys)[0];
  return getMnemonicByKey(defaultKey.id);
};

const findKeyPairByKeyLocator = (keyLocator, mnemonic, network) => {
  const lightningKeyPair = getLightningKeyPairFromMnemonic(mnemonic, network);
  const path = `${keyLocator.keyFamily}/0/${keyLocator.index}`;

  return lightningKeyPair.derivePath(path);
};

// eslint-disable-next-line no-unused-vars
const findKeyPairByPublicKey = (publicKey) => {
  // TODO: Implement.
  throw new Error('Find key by public key is not implemented');
};

const findKeyPair = (keyDescriptor, mnemonic, network) => {
  const { keyLocator, publicKey } = keyDescriptor;

  if (keyLocator) {
    return findKeyPairByKeyLocator(keyLocator, mnemonic, network);
  }

  if (publicKey && publicKey.length) {
    return findKeyPairByPublicKey(publicKey);
  }
};

const isWitnessPubKeyHash = (script) => {
  try {
    bitcoin.payments.p2wpkh({ output: script });
    return true;
  } catch (error) {
    return false;
  }
};

// eslint-disable-next-line max-statements
const getVarIntBuffer = (number) => {
  if (number < 0xfd) {
    const buf = Buffer.alloc(1);
    buf.writeUInt8(number);
    return buf;
  }

  if (number <= MAX_UINT16) {
    const buf = Buffer.alloc(3);
    buf.writeUInt8(0xfd);
    buf.writeUInt16LE(number, 1);
    return buf;
  }

  if (number <= MAX_UINT32) {
    const buf = Buffer.alloc(5);
    buf.writeUInt8(0xfe);
    buf.writeUInt32LE(number, 1);
    return buf;
  }

  const buf = Buffer.alloc(9);
  buf.writeUInt8(0xff);
  writeBigUInt64LE(buf, number, 1);
  return buf;
};

const getVarBytesBuffer = (bytes) => {
  const lengthBuffer = getVarIntBuffer(bytes.length);
  return Buffer.concat([lengthBuffer, bytes]);
};

const getTxOutBuffer = (txout) => {
  const encodedValue = Buffer.alloc(8);
  writeBigUInt64LE(encodedValue, txout.value);

  const encodedPkScript = getVarBytesBuffer(txout.pkScript);

  return Buffer.concat([encodedValue, encodedPkScript]);
};

// eslint-disable-next-line max-statements
const calcWitnessSignatureHash = ({ witnessScript, sigHashes, hashType, transaction, inputIndex, amount }) => {
  if (inputIndex > transaction.inputs.length - 1) {
    throw new Error('Input index is out of bound');
  }

  const sigHash = [];

  // Transaction version.
  const encodedVersion = Buffer.alloc(4);
  encodedVersion.writeUInt32LE(transaction.version);
  sigHash.push(encodedVersion);

  // Pre-calculated hashes.
  const zeroHash = Buffer.alloc(32);

  if (hashType !== HASH_TYPE_ANY_ONE_CAN_PAY) {
    sigHash.push(sigHashes.hashPrevOuts);
  } else {
    sigHash.push(zeroHash);
  }

  if ([HASH_TYPE_ANY_ONE_CAN_PAY, HASH_TYPE_SINGLE, HASH_TYPE_NONE].indexOf(hashType) === -1) {
    sigHash.push(sigHashes.hashSequence);
  } else {
    sigHash.push(zeroHash);
  }

  const input = transaction.inputs[inputIndex];

  // Previous output transaction hash.
  sigHash.push(input.transactionHash);

  // Previous output transaction index.
  const encodedIndex = Buffer.alloc(4);
  encodedIndex.writeUInt32LE(input.index);
  sigHash.push(encodedIndex);

  if (isWitnessPubKeyHash(witnessScript)) {
    const parsedScript = bitcoin.script.decompile(witnessScript);
    sigHash.push(Buffer.from([0x19]));
    sigHash.push(Buffer.from([bitcoin.script.OPS.OP_DUP]));
    sigHash.push(Buffer.from([bitcoin.script.OPS.OP_HASH160]));
    sigHash.push(Buffer.from([OP_DATA_20]));
    sigHash.push(parsedScript[1]);
    sigHash.push(Buffer.from([bitcoin.script.OPS.OP_EQUALVERIFY]));
    sigHash.push(Buffer.from([bitcoin.script.OPS.OP_CHECKSIG]));
  } else {
    const encodedLength = getVarIntBuffer(witnessScript.length);
    sigHash.push(encodedLength);
    sigHash.push(witnessScript);
  }

  // Input amount.
  const encodedAmount = Buffer.alloc(8);
  writeBigUInt64LE(encodedAmount, amount);
  sigHash.push(encodedAmount);

  // Input sequence.
  const encodedSequence = Buffer.alloc(4);
  encodedSequence.writeUInt32LE(input.sequence);
  sigHash.push(encodedSequence);

  // Hash outputs.
  if (hashType !== HASH_TYPE_SINGLE && hashType !== HASH_TYPE_NONE) {
    sigHash.push(sigHashes.hashOutputs);
  } else if (hashType === HASH_TYPE_SINGLE && inputIndex < transaction.outputs.length) {
    const encodedTxOut = getTxOutBuffer(transaction.outputs[inputIndex]);
    const txOutHash = bitcoin.crypto.hash256(encodedTxOut);
    sigHash.push(txOutHash);
  } else {
    sigHash.push(zeroHash);
  }

  // Locktime.
  const encodedLocktime = Buffer.alloc(4);
  encodedLocktime.writeUInt32LE(transaction.lockTime);
  sigHash.push(encodedLocktime);

  // Hash type.
  const encodedHashType = Buffer.alloc(4);
  encodedHashType.writeUInt32LE(SIGHASH_MAP[hashType]);
  sigHash.push(encodedHashType);

  // Concat hash sighash buffers.
  return bitcoin.crypto.hash256(
    Buffer.concat(sigHash)
  );
};

const rawTxInWitnessSignature = ({ transaction, sigHashes, inputIndex, amount, witnessScript, hashType, keyPair }) => {
  const hash = calcWitnessSignatureHash({ witnessScript, sigHashes, hashType, transaction, inputIndex, amount });
  const signature = keyPair.sign(hash);
  const derEncoded = bitcoin.script.signature.encode(signature, SIGHASH_MAP[hashType]);

  return derEncoded;
};

/**
 * Action that signs a transaction (for lightning).
 *
 * @param {Object} request
 * @param {Transaction} request.transaction - Transaction with output to sign.
 * @param {SignDescriptor} request.signDescriptor - Descriptor of key to sign with.
 *
 * @returns {Promise.Object} A promise resolving to an object with a signature.
 */
export const signOutputRaw = ({ transaction, signDescriptor }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { network } = state.settings.bitcoin;

    dispatch({ type: PINE_LIGHTNING_RPC_SIGN_OUTPUT_RAW });

    const mnemonic = await getMnemonic(state.keys.items);
    const keyPair = findKeyPair(signDescriptor.keyDescriptor, mnemonic, network);

    if (!keyPair) {
      throw new Error('Could not locate key');
    }

    const pubkey = bitcoin.ECPair.fromPublicKey(signDescriptor.keyDescriptor.publicKey);

    if (!keyPair.publicKey.equals(pubkey.publicKey)) {
      throw new Error('Located key does not match public key');
    }

    const tweakedKeyPair = tweakKeyPair(keyPair, signDescriptor);

    const witnessSignature = rawTxInWitnessSignature({
      transaction,
      sigHashes: signDescriptor.sigHashes,
      inputIndex: signDescriptor.inputIndex,
      amount: Number(signDescriptor.output.value),
      witnessScript: signDescriptor.witnessScript,
      hashType: signDescriptor.hashType,
      keyPair: tweakedKeyPair
    });

    // Chop off the sighash flag at the end of the signature.
    const signature = witnessSignature.slice(0, witnessSignature.length - 1);

    return { signature };
  };
};
