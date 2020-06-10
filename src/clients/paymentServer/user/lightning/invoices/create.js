import bs58check from 'bs58check';
import { fetchWithTimeout } from '../../../../../network';
import { getAccountKeyPairFromMnemonic, encrypt, sign } from '../../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../../address';
import { getAuthorizationHeader } from '../../../authentication';

const REQUEST_TIMEOUT = 5000; // 5 seconds.

/**
 * Creates a lightning invoice from another Pine user.
 *
 * @param {number} amountSats - Amount in satoshis the invoice should be for.
 * @param {Object} message - Payment message to send to contact when invoice has been paid.
 * @param {number} message.version - Always 1.
 * @param {string} message.type - `'lightning_payment'`.
 * @param {Object} message.data - Additional data attached to the message.
 * @param {Object} contact - Contact to get an invoice for.
 * @param {string} contact.address - The contact's Pine address.
 * @param {string} contact.userId - The contact's user ID.
 * @param {string} contact.publicKey - The contact's public key.
 * @param {Object} credentials - User credentials for authentication.
 * @param {string} credentials.address - Pine address of the user to authenticate.
 * @param {string} credentials.mnemonic - Mnemonic to authenticate and sign the request with.
 * @param {Object} credentials.keyPair - Optional bitcoinjs key pair instead of a mnemonic.
 * @param {string} credentials.userId - Optional user ID instead of deriving it from the mnemonic.
 *
 * @returns {Promise.Object} A promise that resolves to an object ({ id, paymentRequest }).
 */
const create = async (amountSats, message, contact, credentials) => {
  const { hostname } = parseAddress(contact.address);
  const keyPair = credentials.keyPair || getAccountKeyPairFromMnemonic(credentials.mnemonic);
  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${contact.userId}/lightning/invoices`;
  const url = `${baseUrl}${path}`;

  const publicKey = bs58check.decode(contact.publicKey);
  const encryptedMessage = await encrypt(JSON.stringify(message), publicKey);
  const signature = sign(encryptedMessage, keyPair);

  const body = {
    amount: amountSats.toString(),
    paymentMessage: encryptedMessage,
    paymentMessageSignature: signature
  };

  const rawBody = JSON.stringify(body);

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader(credentials.address, path, rawBody, keyPair)
    },
    body: rawBody
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
        throw new SyntaxError();
      }

      return response;
    })
    .catch((error) => {
      if (error.name === 'SyntaxError') {
        throw new Error(
          'Received an invalid response when trying to request new lightning invoice'
        );
      }

      throw error;
    });
};

export default create;
