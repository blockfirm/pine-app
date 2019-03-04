import { getKeyPairFromMnemonic, getUserIdFromPublicKey } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

/**
 * Removes an incoming contact request from a user's Pine server.
 *
 * @param {string} pineAddress - Pine address to remove the contact request from.
 * @param {string} contactRequestId - ID of the contact request to remove.
 * @param {string} mnemonic - Mnemonic to authenticate and sign the request with.
 *
 * @returns {Promise} A promise that resolves if the contact request was removed.
 */
const removeIncoming = (pineAddress, contactRequestId, mnemonic) => {
  const { hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);
  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${userId}/contact-requests/${contactRequestId}`;
  const url = `${baseUrl}${path}`;

  const fetchOptions = {
    method: 'DELETE',
    headers: {
      Authorization: getAuthorizationHeader(userId, path, '', keyPair)
    }
  };

  return fetch(url, fetchOptions)
    .then((response) => {
      if (response.ok) {
        return;
      }

      return response.json().then((error) => {
        throw new Error(error.message);
      });
    });
};

export default removeIncoming;
