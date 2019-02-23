import { getKeyPairFromMnemonic, getUserIdFromPublicKey } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

/**
 * Gets all contact requests for a Pine user.
 *
 * @param {string} pineAddress - Pine address to get contact requests for.
 * @param {string} mnemonic - Mnemonic to authenticate the request with.
 *
 * @returns {Promise} A promise that resolves to an array of contact requests.
 */
const get = (pineAddress, mnemonic) => {
  const { hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);

  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${userId}/contact-requests`;
  const url = `${baseUrl}${path}`;

  const fetchOptions = {
    method: 'GET',
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
        throw new Error('Unknown error when getting contact requests');
      }

      return response;
    });
};

export default get;
