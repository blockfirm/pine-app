import createHash from 'create-hash';

const sha256 = (buffer) => {
  return createHash('sha256').update(buffer).digest();
};

/**
 * Gets a Hash 256 hash of a buffer.
 *
 * @param {Buffer} buffer - Input data to hash.
 *
 * @returns {Buffer} The hash produced by hashing the specified buffer twice with sha256.
 */
const hash256 = (buffer) => {
  return sha256(sha256(buffer));
};

export default hash256;
