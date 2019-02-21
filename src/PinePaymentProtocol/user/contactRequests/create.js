import { getKeyPairFromMnemonic, sign } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import getUser from '../get';

const getAuthorizationHeader = (from, keyPair) => {
  const signature = sign(from, keyPair);
  const credentials = Buffer.from(`${from}:${signature}`).toString('base64');

  return `Basic ${credentials}`;
};

const create = (to, from, mnemonic) => {
  let user;

  return getUser(to)
    .then((_user) => {
      user = _user;

      const { hostname } = parseAddress(to);
      const keyPair = getKeyPairFromMnemonic(mnemonic);
      const baseUrl = resolveBaseUrl(hostname);
      const url = `${baseUrl}/v1/users/${user.id}/contact-requests`;

      const fetchOptions = {
        method: 'POST',
        headers: {
          Authorization: getAuthorizationHeader(from, keyPair)
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
