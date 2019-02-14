import { getKeyPairFromMnemonic, getUserIdFromPublicKey, sign } from '../../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../../address';

const getAuthorizationHeader = (userId, keyPair) => {
  const signature = sign(userId, keyPair);
  const credentials = Buffer.from(`${userId}:${signature}`).toString('base64');

  return `Basic ${credentials}`;
};

const remove = (pineAddress, deviceTokenId, mnemonic) => {
  const { hostname } = parseAddress(pineAddress);
  const keyPair = getKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const userId = getUserIdFromPublicKey(publicKey);
  const baseUrl = resolveBaseUrl(hostname);
  const url = `${baseUrl}/v1/users/${userId}/device-tokens/${deviceTokenId}`;

  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader(userId, keyPair)
    }
  };

  return fetch(url, fetchOptions)
    .then((response) => {
      if (response.ok) {
        return;
      }

      return response.json().then((error) => {
        throw new Error(error.message);
      });
    });
};

export default remove;
