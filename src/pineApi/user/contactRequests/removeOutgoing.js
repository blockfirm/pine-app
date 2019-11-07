import { fetchWithTimeout } from '../../../network';
import { getKeyPairFromMnemonic } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

const REQUEST_TIMEOUT = 5000; // 5 seconds.

/**
 * Removes an outgoing contact request from the recepient's Pine server.
 *
 * @param {string} contactRequest - Contact request to remove.
 * @param {string} contactRequest.id - ID of the contact request to remove.
 * @param {string} contactRequest.to - Pine address the contact request was sent to.
 * @param {string} contactRequest.toUserId - ID of the user the contact request was sent to.
 * @param {object} credentials - User credentials for authentication.
 * @param {string} credentials.address - Pine address of the user to authenticate.
 * @param {string} credentials.mnemonic - Mnemonic to authenticate and sign the request with.
 * @param {object} credentials.keyPair - Optional bitcoinjs key pair instead of a mnemonic.
 *
 * @returns {Promise} A promise that resolves if the contact request was removed.
 */
const removeOutgoing = (contactRequest, credentials) => {
  const { hostname } = parseAddress(contactRequest.to);
  const keyPair = credentials.keyPair || getKeyPairFromMnemonic(credentials.mnemonic);

  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${contactRequest.toUserId}/contact-requests/${contactRequest.id}`;
  const url = `${baseUrl}${path}`;

  const fetchOptions = {
    method: 'DELETE',
    headers: {
      Authorization: getAuthorizationHeader(credentials.address, path, '', keyPair)
    }
  };

  return fetchWithTimeout(url, fetchOptions, REQUEST_TIMEOUT)
    .then((response) => {
      if (response.ok) {
        return;
      }

      return response.json().then((responseError) => {
        const error = new Error(responseError.message);
        error.code = response.status;
        throw error;
      });
    });
};

export default removeOutgoing;
