import { fetchWithTimeout } from '../../../../network';
import { getAccountKeyPairFromMnemonic } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';
import getUser from '../get';

const REQUEST_TIMEOUT = 5000; // 5 seconds.

/**
 * Sends a contact request to a Pine user.
 *
 * @param {string} to - Pine address to send the request to.
 * @param {object} credentials - User credentials for authentication.
 * @param {string} credentials.address - Pine address of the user to authenticate.
 * @param {string} credentials.mnemonic - Mnemonic to authenticate and sign the request with.
 * @param {object} credentials.keyPair - Optional bitcoinjs key pair instead of a mnemonic.
 * @param {string} credentials.userId - Optional user ID instead of deriving it from the mnemonic.
 *
 * @returns {Promise} A promise that resolves to an object ({ contact, accepted }).
 */
const create = (to, credentials) => {
  let user;

  return getUser(to)
    .then((_user) => {
      user = _user;

      const { hostname } = parseAddress(to);
      const keyPair = credentials.keyPair || getAccountKeyPairFromMnemonic(credentials.mnemonic);
      const baseUrl = resolveBaseUrl(hostname);
      const path = `/v1/users/${user.id}/contact-requests`;
      const url = `${baseUrl}${path}`;

      const fetchOptions = {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(credentials.address, path, '', keyPair)
        }
      };

      return fetchWithTimeout(url, fetchOptions, REQUEST_TIMEOUT);
    })
    .then((response) => {
      /**
       * 202 means that the contact request was immediately accepted.
       * 409 means that the other user already has this user as a contact.
       */
      const accepted = [202, 409].includes(response.status);

      if (accepted) {
        return Promise.resolve({ accepted });
      }

      if (response.ok) {
        return response.json().then((contactRequest) => ({ contactRequest }));
      }

      return response.json().then((error) => {
        throw new Error(error.message);
      });
    })
    .then(({ contactRequest, accepted }) => {
      if (contactRequest && !contactRequest.id) {
        throw new Error('Unknown error when creating contact request');
      }

      if (contactRequest) {
        user.waitingForContactRequest = true;

        user.contactRequest = {
          id: contactRequest.id,
          from: contactRequest.from,
          createdAt: contactRequest.createdAt
        };
      }

      user.userId = user.id;
      delete user.id;

      return { contact: user, accepted };
    });
};

export default create;
