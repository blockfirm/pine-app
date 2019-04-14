import eccrypto from 'eccrypto';

/**
 * Decrypt a message using a private key.
 *
 * @param {Object} ecies – ECIES structure of the message to decrypt.
 * @param {Buffer} ecies.iv - Initialization vector (16 bytes).
 * @param {Buffer} ecies.ephemPublicKey - Ephemeral public key (65 bytes).
 * @param {Buffer} ecies.ciphertext - Encrypted data (variable size).
 * @param {Buffer} ecies.mac - Message authentication code (32 bytes).
 * @param {Buffer} privateKey - Private key (secp256k1) to use for decrypting the message (32 bytes).
 *
 * @returns {Promise.<string>} A promise that resolves to the decrypted message (string).
 */
const decrypt = async (ecies, privateKey) => {
  const plaintext = await eccrypto.decrypt(privateKey, ecies);
  return plaintext.toString();
};

export default decrypt;
