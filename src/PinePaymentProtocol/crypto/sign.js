import secp256k1 from 'secp256k1';
import hash256 from './hash256';

const encodeSignature = (signature, compressed) => {
  let { recovery } = signature;

  if (compressed) {
    recovery += 4;
  }

  return Buffer.concat([
    Buffer.alloc(1, recovery + 27),
    signature.signature
  ]).toString('base64');
};

/**
 * Gets a signature of a message signed by the specified key.
 *
 * @param {string} message - Message to sign.
 * @param {Object} keyPair - bitcoinjs key pair.
 *
 * @returns {string} A base64 formatted secp256k1 signature of the specified message.
 */
const sign = (message, keyPair) => {
  const hash = hash256(Buffer.from(message));
  const signature = secp256k1.sign(hash, keyPair.privateKey);

  return encodeSignature(signature, keyPair.compressed);
};

export default sign;
