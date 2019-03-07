import { getKeyPairFromMnemonic } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';
import getUser from '../get';

/**
 * Sends a contact request to a Pine user.
 *
 * @param {string} to - Pine address to send the request to.
 * @param {string} from - Pine address to send the request from.
 * @param {string} mnemonic - Mnemonic to sign the request with.
 *
 * @returns {Promise} A promise that resolves to an object ({ contact, accepted }).
 */
const create = (to, from, mnemonic) => {
  let user;

  return getUser(to)
    .then((_user) => {
      user = _user;

      const { hostname } = parseAddress(to);
      const keyPair = getKeyPairFromMnemonic(mnemonic);
      const baseUrl = resolveBaseUrl(hostname);
      const path = `/v1/users/${user.id}/contact-requests`;
      const url = `${baseUrl}${path}`;

      const fetchOptions = {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(from, path, '', keyPair)
        }
      };

      return fetch(url, fetchOptions);
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
