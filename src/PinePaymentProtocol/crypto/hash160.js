import createHash from 'create-hash';

const sha256 = (buffer) => {
  return createHash('sha256').update(buffer).digest();
};

/**
 * Gets a Hash 160 hash of a buffer.
 *
 * @param {Buffer} buffer - Input data to hash.
 *
 * @returns {Buffer} A ripemd160 hash of the sha256 hash of the specified buffer.
 */
const hash160 = (buffer) => {
  return createHash('ripemd160').update(sha256(buffer)).digest();
};

export default hash160;
