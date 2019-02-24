import { getKeyPairFromMnemonic, getUserIdFromPublicKey } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

/**
 * Adds a device token to a user's Pine server.
 *
 * @param {string} pineAddress - Pine address to add the device token to.
 * @param {object} deviceToken - Object with device token to add.
 * @param {string} deviceToken.ios - iOS device token to add.
 * @param {string} mnemonic - Mnemonic to sign the request with.
 *
 * @returns {Promise} A promise that resolves to the device token's id.
 */
const add = (pineAddress, deviceToken, mnemonic) => {
  const { hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);

  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${userId}/device-tokens`;
  const url = `${baseUrl}${path}`;

  const body = deviceToken;
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
        throw new Error('Unknown error when adding device token');
      }

      return response.id;
    });
};

export default add;
