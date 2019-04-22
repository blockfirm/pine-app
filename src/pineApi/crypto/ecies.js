import crypto from 'crypto';
import { ec as EC } from 'elliptic';
import getRandomBytes from '../../crypto/getRandomBytes';

const ec = new EC('secp256k1');

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
 * Encrypt a message using AES-256-CBC encryption.
 *
 * @param {Buffer} iv - Initialization vector (16 bytes).
 * @param {Buffer} key - Encryption key (32 bytes).
 * @param {Buffer} plaintext - Message to encrypt.
 *
 * @returns {Buffer} ciphertext
 */
const aes256CbcEncrypt = (iv, key, plaintext) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = cipher.update(plaintext);
  const final = cipher.final();

  return Buffer.concat([encrypted, final]);
};

/**
 * Decrypt an AES-256-CBC encrypted message.
 *
 * @param {Buffer} iv - Initialization vector (16 bytes).
 * @param {Buffer} key - Encryption key (32 bytes).
 * @param {Buffer} ciphertext - Encrypted message.
 *
 * @returns {Buffer} The decrypted message (plaintext).
 */
const aes256CbcDecrypt = (iv, key, ciphertext) => {
  const cipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = cipher.update(ciphertext);
  const final = cipher.final();

  return Buffer.concat([decrypted, final]);
};

/**
 * Encrypt a message using ECIES encryption.
 *
 * @param {Buffer} plaintext - Message to encrypt.
 * @param {Buffer} toPublicKey - Public key (secp256k1) of the recipient (65 bytes).
 *
 * @returns {Promise.Object} A promise that resolves to an ECIES structure of the encrypted message.
 */
export const encrypt = async (plaintext, toPublicKey) => {
  const iv = await getRandomBytes(16);
  const ephemPrivateKey = ec.keyFromPrivate(await getEphemPrivateKey());
  const ephemPublicKey = ephemPrivateKey.getPublic();
  const ephemPublicKeyEncoded = Buffer.from(ephemPublicKey.encode());
  const px = ephemPrivateKey.derive(ec.keyFromPublic(toPublicKey).getPublic());
  const hash = crypto.createHash('sha512').update(px.toArrayLike(Buffer)).digest();
  const encryptionKey = hash.slice(0, 32);
  const macKey = hash.slice(32);
  const ciphertext = aes256CbcEncrypt(iv, encryptionKey, plaintext);
  const dataToMac = Buffer.concat([iv, ephemPublicKeyEncoded, ciphertext]);
  const mac = crypto.createHmac('sha256', macKey).update(dataToMac).digest();

  return {
    ephemPublicKey: ephemPublicKeyEncoded,
    iv,
    ciphertext,
    mac
  };
};

/**
 * Decrypt an ECIES encrypted message.
 *
 * @param {Object} ecies - ECIES structure of the message to decrypt.
 * @param {Buffer} ecies.iv - Initialization vector (16 bytes).
 * @param {Buffer} ecies.ephemPublicKey - Ephemeral public key (65 bytes).
 * @param {Buffer} ecies.ciphertext - Encrypted data (variable size).
 * @param {Buffer} ecies.mac - Message authentication code (32 bytes).
 * @param {Buffer} privateKey - Private key (secp256k1) to use for decrypting the message (32 bytes).
 *
 * @returns {Buffer} The decrypted message (plaintext).
 */
export const decrypt = (ecies, privateKey) => {
  const ephemPublicKey = ec.keyFromPublic(ecies.ephemPublicKey).getPublic();
  const px = ec.keyFromPrivate(privateKey).derive(ephemPublicKey);
  const hash = crypto.createHash('sha512').update(px.toArrayLike(Buffer)).digest();
  const encryptionKey = hash.slice(0, 32);
  const macKey = hash.slice(32);
  const dataToMac = Buffer.concat([ecies.iv, ecies.ephemPublicKey, ecies.ciphertext]);
  const computedMac = crypto.createHmac('sha256', macKey).update(dataToMac).digest();

  if (Buffer.compare(computedMac, ecies.mac) !== 0) {
    throw new Error('MAC mismatch');
  }

  return aes256CbcDecrypt(ecies.iv, encryptionKey, ecies.ciphertext);
};
