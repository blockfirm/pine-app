import { getAccountKeyPairFromMnemonic } from '../../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../../address';
import { getAuthorizationHeader } from '../../../authentication';

/**
 * Gets inbound lightning capacity for a contact.
 *
 * @param {string} userId - User ID to get lightning capacity for.
 * @param {Object} credentials - User credentials for authentication.
 * @param {string} credentials.address - Pine address of the user to authenticate.
 * @param {string} credentials.mnemonic - Mnemonic to authenticate and sign the request with.
 * @param {Object} credentials.keyPair - Optional bitcoinjs key pair instead of a mnemonic.
 * @param {string} credentials.userId - Optional user ID instead of deriving it from the mnemonic.
 *
 * @returns {Promise.number} A promise that resolves to the inbound capacity in satoshis.
 */
const get = (userId, credentials) => {
  const { hostname } = parseAddress(credentials.address);
  const keyPair = credentials.keyPair || getAccountKeyPairFromMnemonic(credentials.mnemonic);

  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${userId}/lightning/capacity`;
  const url = `${baseUrl}${path}`;

  const fetchOptions = {
    headers: {
      Authorization: getAuthorizationHeader(credentials.address, path, '', keyPair)
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
      if (!response || !response.inbound) {
        throw new Error('Unknown error when getting inbound lightning capacity for contact');
      }

      return parseInt(response.inbound);
    });
};

export default get;
