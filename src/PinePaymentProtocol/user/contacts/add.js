import { getKeyPairFromMnemonic, getUserIdFromPublicKey } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

/**
 * Adds a contact to a user's Pine server.
 *
 * @param {object} contact - Contact to add.
 * @param {string} contact.address - The contact's Pine address.
 * @param {boolean} contact.waitingForContactRequest - Whether or not the user is waiting for the contact to accept a contact request.
 * @param {object} credentials - User credentials for authentication.
 * @param {string} credentials.address - Pine address of the user to authenticate.
 * @param {string} credentials.mnemonic - Mnemonic to authenticate and sign the request with.
 * @param {object} credentials.keyPair - Optional bitcoinjs key pair instead of a mnemonic.
 * @param {string} credentials.userId - Optional user ID instead of deriving it from the mnemonic.
 *
 * @returns {Promise} A promise that resolves to the added contact.
 */
const add = (contact, credentials) => {
  const { hostname } = parseAddress(credentials.address);
  const keyPair = credentials.keyPair || getKeyPairFromMnemonic(credentials.mnemonic);
  const userId = credentials.userId || getUserIdFromPublicKey(keyPair.publicKey);

  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${userId}/contacts`;
  const url = `${baseUrl}${path}`;

  const body = {
    address: contact.address,
    waitingForContactRequest: contact.waitingForContactRequest
  };

  const rawBody = JSON.stringify(body);

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader(userId, path, rawBody, keyPair)
    },
    body: rawBody
  };

  return fetch(url, fetchOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return response.json().then((error) => {
        throw new Error(error.message);
      });
    })
    .then((response) => {
      if (!response.id) {
        throw new Error('Unknown error when adding contact');
      }

      return response;
    });
};

export default add;
