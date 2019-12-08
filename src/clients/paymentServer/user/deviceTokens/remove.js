import { getAccountKeyPairFromMnemonic, getUserIdFromPublicKey } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

/**
 * Removes a device token from a user's Pine server.
 *
 * @param {string} deviceTokenId - ID of the device token to remove.
 * @param {object} credentials - User credentials for authentication.
 * @param {string} credentials.address - Pine address of the user to authenticate.
 * @param {string} credentials.mnemonic - Mnemonic to authenticate and sign the request with.
 * @param {object} credentials.keyPair - Optional bitcoinjs key pair instead of a mnemonic.
 * @param {string} credentials.userId - Optional user ID instead of deriving it from the mnemonic.
 *
 * @returns {Promise} A promise that resolves if the device token was removed.
 */
const remove = (deviceTokenId, credentials) => {
  const { hostname } = parseAddress(credentials.address);
  const keyPair = credentials.keyPair || getAccountKeyPairFromMnemonic(credentials.mnemonic);
  const userId = credentials.userId || getUserIdFromPublicKey(keyPair.publicKey);

  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${userId}/device-tokens/${deviceTokenId}`;
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

export default remove;
