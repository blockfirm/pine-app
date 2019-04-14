import eccrypto from 'eccrypto';
import getRandomBytes from '../../crypto/getRandomBytes';

const ZERO32 = Buffer.alloc(32, 0);
const EC_GROUP_ORDER = Buffer.from('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 'hex');

const isScalar = (buffer) => {
  return Buffer.isBuffer(buffer) && buffer.length === 32;
};

const isValidPrivateKey = (privateKey) => {
  if (!isScalar(privateKey)) {
    return false;
  }

  return privateKey.compare(ZERO32) > 0 && privateKey.compare(EC_GROUP_ORDER) < 0;
};

const getEphemPrivateKey = async () => {
  let ephemPrivateKey = await getRandomBytes(32);

  /**
   * There is a very small possibility that it is not a valid key.
   * <https://github.com/bitchan/eccrypto/blob/master/browser.js#L213>
   */
  while (!isValidPrivateKey(ephemPrivateKey)) {
    ephemPrivateKey = await getRandomBytes(32);
  }

  return ephemPrivateKey;
};

/**
 * Encrypt a message using a public key.
 *
 * @param {string} message – Message to encrypt.
 * @param {Buffer} publicKey - Public key (secp256k1) of the recipient (33 or 65 bytes).
 *
 * @returns {Promise.<Object>} A promise that resolves to an ECIES structure of the encrypted message.
 */
const encrypt = async (message, publicKey) => {
  /**
   * If `iv` and `ephemPrivateKey` are not provided, the eccrypto library will
   * use `randomBytes()` synchronously to generate them. Using `randomBytes()`
   * synchronously will not use iOS's SecRandomCopyBytes and will be insecure.
   * Therefore, generate them asynchronously and pass them with the options.
   */
  const iv = await getRandomBytes(16);
  const ephemPrivateKey = await getEphemPrivateKey();
  const options = { iv, ephemPrivateKey };

  return eccrypto.encrypt(publicKey, Buffer.from(message), options);
};

export default encrypt;
