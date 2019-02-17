import { getKeyPairFromMnemonic, sign } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';
import getUser from '../get';

const getAuthorizationHeader = (from, keyPair) => {
  const signature = sign(from, keyPair);
  const credentials = Buffer.from(`${from}:${signature}`).toString('base64');

  return `Basic ${credentials}`;
};

const create = (to, from, mnemonic) => {
  return getUser(to)
    .then((user) => {
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

      return response.id;
    });
};

export default create;
