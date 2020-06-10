import BN from 'bn.js';
import { ec as EC } from 'elliptic';
import * as bitcoin from 'bitcoinjs-lib';

const ec = new EC('secp256k1');
const ecparams = ec.curve;

const singleTweakKeyPair = (keyPair, tweak) => {
  const privateKeyInt = new BN(keyPair.privateKey.toString('hex'), 16);
  let tweakInt = new BN(tweak.toString('hex'), 16);

  tweakInt = tweakInt.add(privateKeyInt);
  tweakInt = tweakInt.mod(ecparams.n);

  const tweakedBuffer = tweakInt.toArrayLike(Buffer, 'be');
  const tweakedKeyPair = bitcoin.ECPair.fromPrivateKey(tweakedBuffer);

  return tweakedKeyPair;
};

const tweakKeyPair = (keyPair, signDescriptor) => {
  const { singleTweak, doubleTweak } = signDescriptor;

  if (doubleTweak && doubleTweak.length) {
    // TODO: Implement double tweak.
    throw new Error('DoubleTweak is not implemented');
  }

  if (singleTweak && singleTweak.length) {
    return singleTweakKeyPair(keyPair, singleTweak);
  }

  return keyPair;
};

export default tweakKeyPair;
