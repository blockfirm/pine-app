import { getAccountKeyPairFromMnemonic, getUserIdFromPublicKey } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';

/**
 * Removes a message from a user's Pine server.
 *
 * @param {string} messageId - ID of the message to remove.
 * @param {Object} [recipient] - Recipient of the message, if removing a sent message.
 * @param {string} recipient.address - Recipient's Pine address.
 * @param {string} recipient.userId - Recipient's user ID.
 * @param {Object} credentials - User credentials for authentication.
 * @param {string} credentials.address - Pine address of the user to authenticate.
 * @param {string} credentials.mnemonic - Mnemonic to authenticate and sign the request with.
 * @param {Object} credentials.keyPair - Optional bitcoinjs key pair instead of a mnemonic.
 * @param {string} credentials.userId - Optional user ID instead of deriving it from the mnemonic.
 *
 * @returns {Promise} A promise that resolves if the message was removed.
 */
const remove = (messageId, recipient = {}, credentials) => {
  const { hostname } = parseAddress(recipient.address || credentials.address);
  const keyPair = credentials.keyPair || getAccountKeyPairFromMnemonic(credentials.mnemonic);
  const userId = credentials.userId || getUserIdFromPublicKey(keyPair.publicKey);

  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${recipient.userId || userId}/messages/${messageId}`;
  const url = `${baseUrl}${path}`;

  let authorizationHeader;

  if (recipient.address) {
    // External authentication.
    authorizationHeader = getAuthorizationHeader(credentials.address, path, '', keyPair);
  } else {
    // Internal authentication.
    authorizationHeader = getAuthorizationHeader(userId, path, '', keyPair);
  }

  const fetchOptions = {
    method: 'DELETE',
    headers: {
      Authorization: authorizationHeader
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
