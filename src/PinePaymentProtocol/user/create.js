import bs58check from 'bs58check';
import { getKeyPairFromMnemonic, getUserIdFromPublicKey, sign } from '../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../address';

const create = (pineAddress, mnemonic) => {
  const { username, hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);
  const signature = sign(username, keyPair);

  const baseUrl = resolveBaseUrl(hostname);
  const url = `${baseUrl}/v1/users`;

  const body = {
    id: userId,
    publicKey: bs58check.encode(publicKey),
    username,
    signature
  };

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
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
