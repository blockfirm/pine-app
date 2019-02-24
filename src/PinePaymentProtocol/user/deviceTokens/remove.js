import { getKeyPairFromMnemonic, getUserIdFromPublicKey } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

/**
 * Removes a device token from a user's Pine server.
 *
 * @param {string} pineAddress - Pine address to remove the device token from.
 * @param {string} deviceTokenId - ID of the device token to remove.
 * @param {string} mnemonic - Mnemonic to sign the request with.
 *
 * @returns {Promise} A promise that resolves if the device token was removed.
 */
const remove = (pineAddress, deviceTokenId, mnemonic) => {
  const { hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);
  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${userId}/device-tokens/${deviceTokenId}`;
  const url = `${baseUrl}${path}`;

  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader(userId, path, '', keyPair)
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

export default remove;
