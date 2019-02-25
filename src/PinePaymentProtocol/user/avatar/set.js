import { getKeyPairFromMnemonic, getUserIdFromPublicKey } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

/**
 * Sets a new profile picture for a Pine user.
 *
 * @param {string} pineAddress - Pine address to set a new profile picture for.
 * @param {string} image - Base64-encoded image to use as profile picture.
 * @param {string} mnemonic - Mnemonic to authenticate and sign the request with.
 *
 * @returns {Promise} A promise that resolves to an object with a checksum of the avatar.
 */
const set = (pineAddress, image, mnemonic) => {
  const { hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);

  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${userId}/avatar`;
  const url = `${baseUrl}${path}`;

  const body = { image };
  const rawBody = JSON.stringify(body);

  const fetchOptions = {
    method: 'PUT',
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
      if (!response.checksum) {
        throw new Error('Unknown error when uploading avatar');
      }

      return response;
    });
};

export default set;
