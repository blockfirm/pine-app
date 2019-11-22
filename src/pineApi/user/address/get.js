import { fetchWithTimeout } from '../../../network';
import { getAccountKeyPairFromMnemonic } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

const REQUEST_TIMEOUT = 5000; // 5 seconds.

/**
 * Gets a bitcoin address for a contact.
 *
 * @param {object} user - User to get a bitcoin address for.
 * @param {string} user.userId - ID of the user.
 * @param {string} user.address - Pine address of the user.
 * @param {object} credentials - User credentials for authentication.
 * @param {string} credentials.address - Pine address of the user to authenticate.
 * @param {string} credentials.mnemonic - Mnemonic to authenticate and sign the request with.
 * @param {object} credentials.keyPair - Optional bitcoinjs key pair instead of a mnemonic.
 *
 * @returns {Promise} A promise that resolves to a bitcoin address (string).
 */
const get = (user, credentials) => {
  const { hostname } = parseAddress(user.address);
  const keyPair = credentials.keyPair || getAccountKeyPairFromMnemonic(credentials.mnemonic);

  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${user.userId}/address`;
  const url = `${baseUrl}${path}`;

  const fetchOptions = {
    method: 'GET',
    headers: {
      Authorization: getAuthorizationHeader(credentials.address, path, '', keyPair)
    }
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
      if (!response || !response.address) {
        throw new Error('Unknown error when getting address');
      }

      return response.address;
    });
};

export default get;
