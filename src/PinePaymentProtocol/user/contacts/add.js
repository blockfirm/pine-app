import { getKeyPairFromMnemonic, getUserIdFromPublicKey } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

/**
 * Adds a contact to a user's Pine server.
 *
 * @param {string} pineAddress - Pine address to add the contact to.
 * @param {object} contact - Contact to add.
 * @param {string} contact.address - The contact's Pine address.
 * @param {boolean} contact.waitingForContactRequest - Whether or not the user is waiting for the contact to accept a contact request.
 * @param {string} mnemonic - Mnemonic to authenticate and sign the request with.
 *
 * @returns {Promise} A promise that resolves to the added contact.
 */
const add = (pineAddress, contact, mnemonic) => {
  const { hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);

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
