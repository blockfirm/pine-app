import secp256k1 from 'secp256k1';
import hash256 from './hash256';
import getUserIdFromPublicKey from './getUserIdFromPublicKey';

const decodeSignature = (signature) => {
  const buffer = Buffer.from(signature, 'base64');

  if (buffer.length !== 65) {
    throw new Error('Invalid signature length');
  }

  const flag = buffer.readUInt8(0) - 27;

  if (flag > 7) {
    throw new Error('Invalid signature flag');
  }

  return {
    compressed: Boolean(flag & 4),
    recovery: flag & 3,
    signature: buffer.slice(1)
  };
};

/**
 * Verifies that a message was signed by a specific user.
 *
 * @param {string} message - Message to verify.
 * @param {string} signature - Signature to verify.
 * @param {string} userId - User ID to verify the signature against.
 *
 * @returns {boolean} Whether or not the message was signed by the specified user.
 */
const verify = (message, signature, userId) => {
  const parsedSignature = decodeSignature(signature);
  const hash = hash256(Buffer.from(message));

  const recoveredPublicKey = secp256k1.recover(
    hash,
    parsedSignature.signature,
    parsedSignature.recovery,
    parsedSignature.compressed
  );

  const recoveredUserId = getUserIdFromPublicKey(recoveredPublicKey);

  return recoveredUserId === userId;
};

export default verify;
