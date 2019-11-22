import bs58check from 'bs58check';
import { fetchWithTimeout } from '../../../network';
import { getAccountKeyPairFromMnemonic, encrypt, sign } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

const REQUEST_TIMEOUT = 5000; // 5 seconds.

/**
 * Sends an end-to-end encrypted message to another Pine user.
 *
 * @param {Object} message - Message payload to send.
 * @param {number} message.version - Always 1.
 * @param {string} message.type - Only `'payment'` at the moment.
 * @param {Object} message.data - Additional data attached to the message.
 * @param {Object} contact - Contact to send the message to.
 * @param {string} contact.address - The contact's Pine address.
 * @param {string} contact.userId - The contact's user ID.
 * @param {string} contact.publicKey - The contact's public key.
 * @param {Object} credentials - User credentials for authentication.
 * @param {string} credentials.address - Pine address of the user to authenticate.
 * @param {string} credentials.mnemonic - Mnemonic to authenticate and sign the request with.
 * @param {Object} credentials.keyPair - Optional bitcoinjs key pair instead of a mnemonic.
 * @param {string} credentials.userId - Optional user ID instead of deriving it from the mnemonic.
 *
 * @returns {Promise.Object} A promise that resolves to an object ({ id }).
 */
const send = async (message, contact, credentials) => {
  const { hostname } = parseAddress(contact.address);
  const keyPair = credentials.keyPair || getAccountKeyPairFromMnemonic(credentials.mnemonic);
  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${contact.userId}/messages`;
  const url = `${baseUrl}${path}`;

  const publicKey = bs58check.decode(contact.publicKey);
  const encryptedMessage = await encrypt(JSON.stringify(message), publicKey);
  const signature = sign(encryptedMessage, keyPair);

  const body = {
    encryptedMessage,
    signature
  };

  const rawBody = JSON.stringify(body);

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader(credentials.address, path, rawBody, keyPair)
    },
    body: rawBody
  };

  return fetchWithTimeout(url, fetchOptions, REQUEST_TIMEOUT)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return response.json().then((error) => {
        throw new Error(error.message);
      });
    })
    .then((response) => {
      if (!response || !response.id) {
        throw new Error('Unknown error when sending message');
      }

      return response;
    });
};

export default send;
