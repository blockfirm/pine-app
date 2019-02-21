import bs58check from 'bs58check';
import { getKeyPairFromMnemonic, getUserIdFromPublicKey } from '../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../address';
import { getAuthorizationHeader } from '../authentication';

const create = (pineAddress, mnemonic) => {
  const { username, hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);

  const baseUrl = resolveBaseUrl(hostname);
  const path = '/v1/users';
  const url = `${baseUrl}${path}`;

  const body = {
    publicKey: bs58check.encode(publicKey),
    username
  };

  const rawBody = JSON.stringify(body);

  const fetchOptions = {
    method: 'POST',
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
      if (response.id !== userId || response.publicKey !== body.publicKey) {
        throw new Error('Unknown error when creating user');
      }

      return response;
    });
};

export default create;
