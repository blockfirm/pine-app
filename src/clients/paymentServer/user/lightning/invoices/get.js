import { fetchWithTimeout } from '../../../../../network';
import { getAccountKeyPairFromMnemonic, getUserIdFromPublicKey } from '../../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../../address';
import { getAuthorizationHeader } from '../../../authentication';

const REQUEST_TIMEOUT = 5000; // 5 seconds.

/**
 * Gets an existing lightning invoice from a Pine server.
 *
 * @param {Object} invoice - Metadata about the invoice to get.
 * @param {string} invoice.id - ID of invoice to get.
 * @param {string} invoice.payee - Payee of the invoice.
 * @param {string} invoice.userId - The payee's user ID.
 * @param {Object} credentials - User credentials for authentication.
 * @param {string} credentials.address - Pine address of the user to authenticate.
 * @param {string} credentials.mnemonic - Mnemonic to authenticate and sign the request with.
 * @param {Object} credentials.keyPair - Optional bitcoinjs key pair instead of a mnemonic.
 * @param {string} credentials.userId - Optional user ID instead of deriving it from the mnemonic.
 *
 * @returns {Promise.Object[]} A promise that resolves to the unredeemed invoices.
 */
const get = (invoice, credentials) => {
  const { hostname } = parseAddress(invoice.payee);
  const keyPair = credentials.keyPair || getAccountKeyPairFromMnemonic(credentials.mnemonic);

  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${invoice.userId}/lightning/invoices/${invoice.id}`;
  const url = `${baseUrl}${path}`;

  const fetchOptions = {
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
      if (!response || !response.id) {
        throw new Error('Unknown error when getting invoice');
      }

      return response;
    });
};

export default get;
