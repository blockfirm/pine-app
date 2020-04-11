import bs58check from 'bs58check';
import getAccountPublicKeyFromMnemonic from '../../../crypto/getAccountPublicKeyFromMnemonic';
import { getAccountKeyPairFromMnemonic, getUserIdFromPublicKey } from '../crypto';
import { parse as parseAddress, resolveBaseUrl } from '../address';
import { getAuthorizationHeader } from '../authentication';

const BIP49_ACCOUNT_INDEX = 0;

/**
 * Tries to register a Pine address.
 *
 * @param {string} pineAddress - Pine address to register.
 * @param {string} mnemonic - Mnemonic to use to authenticate the new address.
 * @param {string} bitcoinNetwork - 'mainnet' or 'testnet' – needed for the extended public key.
 *
 * @returns {Promise} A promise that resolves to the created user.
 */
const create = (pineAddress, mnemonic, bitcoinNetwork) => {
  const { username, hostname } = parseAddress(pineAddress);
  const keyPair = getAccountKeyPairFromMnemonic(mnemonic);
  const publicKey = keyPair.publicKey;
  const extendedPublicKey = getAccountPublicKeyFromMnemonic(mnemonic, bitcoinNetwork, BIP49_ACCOUNT_INDEX);
  const userId = getUserIdFromPublicKey(publicKey);

  const baseUrl = resolveBaseUrl(hostname);
  const path = '/v1/users';
  const url = `${baseUrl}${path}`;

  const body = {
    publicKey: bs58check.encode(publicKey),
    extendedPublicKey,
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
        throw new SyntaxError();
      }

      return response;
    })
    .catch((error) => {
      if (error.name === 'SyntaxError') {
        throw new Error('Received an invalid response when trying to create user');
      }

      throw error;
    });
};

export default create;
