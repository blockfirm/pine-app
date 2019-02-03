import { getKeyPairFromMnemonic, getUserIdFromPublicKey, sign } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';

const getAuthorizationHeader = (userId, rawBody, keyPair) => {
  const signature = sign(rawBody, keyPair);
  const credentials = Buffer.from(`${userId}:${signature}`).toString('base64');

  return `Basic ${credentials}`;
};

const set = (pineAddress, image, mnemonic) => {
  const { hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);

  const baseUrl = resolveBaseUrl(hostname);
  const url = `${baseUrl}/v1/users/${userId}/avatar`;

  const body = { image };
  const rawBody = JSON.stringify(body);

  const fetchOptions = {
    method: 'PUT',
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
      if (!response.checksum) {
        throw new Error('Unknown error when uploading avatar');
      }

      return response;
    });
};

export default set;
