import * as ECIES from './ecies';

const deserializeEcies = (encryptedMessage) => {
  const json = Buffer.from(encryptedMessage, 'base64').toString();
  const ecies = JSON.parse(json);

  return {
    iv: Buffer.from(ecies.iv, 'hex'),
    ephemPublicKey: Buffer.from(ecies.ephemPublicKey, 'hex'),
    ciphertext: Buffer.from(ecies.ciphertext, 'hex'),
    mac: Buffer.from(ecies.mac, 'hex')
  };
};

/**
 * Decrypt a message using a private key.
 *
 * @param {string} encryptedMessage – Encrypted message to decrypt.
 * @param {Buffer} privateKey - Private key (secp256k1) to use for decrypting the message (32 bytes).
 *
 * @returns {Promise.<string>} A promise that resolves to the decrypted message.
 */
const decrypt = async (encryptedMessage, privateKey) => {
  const ecies = deserializeEcies(encryptedMessage);
  const plaintext = ECIES.decrypt(ecies, privateKey);

  return plaintext.toString();
};

export default decrypt;
