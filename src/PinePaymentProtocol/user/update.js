import { getKeyPairFromMnemonic, getUserIdFromPublicKey, sign } from '../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../address';

const getAuthorizationHeader = (userId, rawBody, keyPair) => {
  const signature = sign(rawBody, keyPair);
  const credentials = Buffer.from(`${userId}:${signature}`).toString('base64');

  return `Basic ${credentials}`;
};

const update = (pineAddress, user, mnemonic) => {
  const { hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);

  const baseUrl = resolveBaseUrl(hostname);
  const url = `${baseUrl}/v1/users/${userId}`;

  const body = {
    displayName: user.displayName
  };

  const rawBody = JSON.stringify(body);

  const fetchOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader(userId, rawBody, keyPair)
    },
    body: rawBody
  };

  return fetch(url, fetchOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return response.json().then((error) => {
        throw new Error(error.message);
      });
    })
    .then((response) => {
      if (response.id !== userId) {
        throw new Error('Unknown error when updating user');
      }

      return response;
    });
};

export default update;
