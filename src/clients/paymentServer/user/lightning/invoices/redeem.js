import { getAccountKeyPairFromMnemonic, getUserIdFromPublicKey } from '../../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../../address';
import { getAuthorizationHeader } from '../../../authentication';

/**
 * Redeems a lightning invoice from the Pine server's gateway lightning node.
 *
 * @param {string} invoiceId - ID of invoice to redeem.
 * @param {string} paymentRequest - Lightning payment request to redeem the invoice to.
 * @param {Object} credentials - User credentials for authentication.
 * @param {string} credentials.address - Pine address of the user to authenticate.
 * @param {string} credentials.mnemonic - Mnemonic to authenticate and sign the request with.
 * @param {Object} credentials.keyPair - Optional bitcoinjs key pair instead of a mnemonic.
 * @param {string} credentials.userId - Optional user ID instead of deriving it from the mnemonic.
 *
 * @returns {Promise} A promise that resolves when the invoice has been redeemed.
 */
// eslint-disable-next-line max-statements
const redeem = async (invoiceId, paymentRequest, credentials) => {
  const { hostname } = parseAddress(credentials.address);
  const keyPair = credentials.keyPair || getAccountKeyPairFromMnemonic(credentials.mnemonic);
  const userId = credentials.userId || getUserIdFromPublicKey(keyPair.publicKey);

  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${userId}/lightning/invoices/${invoiceId}/redeem`;
  const url = `${baseUrl}${path}`;

  const body = { paymentRequest };
  const rawBody = JSON.stringify(body);

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader(userId, path, rawBody, keyPair)
    },
    body: rawBody
  };

  const response = await fetch(url, fetchOptions);

  if (response.ok) {
    return;
  }

  try {
    const error = await response.json();
    throw new Error(error.message);
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error('Received an invalid response when trying to redeem lightning invoice');
    }

    throw error;
  }
};

export default redeem;
