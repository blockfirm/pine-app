import secp256k1 from 'secp256k1';
import * as ECIES from './ecies';

const serializeEcies = (ecies) => {
  const json = JSON.stringify({
    iv: ecies.iv.toString('hex'),
    ephemPublicKey: ecies.ephemPublicKey.toString('hex'),
    ciphertext: ecies.ciphertext.toString('hex'),
    mac: ecies.mac.toString('hex')
  });

  return Buffer.from(json).toString('base64');
};

/**
 * Encrypt a message using a public key.
 *
 * @param {string} message – Message to encrypt.
 * @param {Buffer} publicKey - Public key (secp256k1) of the recipient (33 or 65 bytes).
 *
 * @returns {Promise.<string>} A promise that resolves to the encrypted message.
 */
const encrypt = async (message, publicKey) => {
  const uncompressedPublicKey = secp256k1.publicKeyConvert(publicKey, false);
  const ecies = await ECIES.encrypt(Buffer.from(message), uncompressedPublicKey);

  return serializeEcies(ecies);
};

export default encrypt;
