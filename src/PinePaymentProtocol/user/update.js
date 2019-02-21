import { getKeyPairFromMnemonic, getUserIdFromPublicKey } from '../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../address';
import { getAuthorizationHeader } from '../authentication';

const update = (pineAddress, user, mnemonic) => {
  const { hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);

  const baseUrl = resolveBaseUrl(hostname);
  const path = `/v1/users/${userId}`;
  const url = `${baseUrl}${path}`;

  const body = {
    displayName: user.displayName
  };

  const rawBody = JSON.stringify(body);

  const fetchOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader(userId, path, rawBody, keyPair)
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
