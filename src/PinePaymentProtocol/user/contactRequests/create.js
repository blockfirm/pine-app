import { getKeyPairFromMnemonic } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import { getAuthorizationHeader } from '../../authentication';
import getUser from '../get';

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
      if (response.ok) {
        return response.json();
      }

      return response.json().then((error) => {
        throw new Error(error.message);
      });
    })
    .then((response) => {
      if (!response.id) {
        throw new Error('Unknown error when creating contact request');
      }

      user.contactRequest = {
        id: response.id,
        from: response.from,
        createdAt: response.createdAt
      };

      user.userId = user.id;
      delete user.id;

      return user;
    });
};

export default create;
