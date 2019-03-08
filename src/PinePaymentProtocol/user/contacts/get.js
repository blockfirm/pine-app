import { getKeyPairFromMnemonic, getUserIdFromPublicKey } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

/**
 * Gets all contacts from a user's Pine server.
 *
 * @param {string} pineAddress - Pine address to get the contacts from.
 * @param {string} mnemonic - Mnemonic to authenticate and sign the request with.
 *
 * @returns {Promise} A promise that resolves to the contacts.
 */
const get = (pineAddress, mnemonic) => {
  const { hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);
  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${userId}/contacts`;
  const url = `${baseUrl}${path}`;

  const fetchOptions = {
    headers: {
      Authorization: getAuthorizationHeader(userId, path, '', keyPair)
    }
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
      if (!Array.isArray(response)) {
        throw new Error('Unknown error when getting contacts');
      }

      return response;
    });
};

export default get;
