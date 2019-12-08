import { sign } from '../crypto';

/**
 * Creates an HTTP Authorization header with user credentials
 * consisting of a user ID or address and a signature of the
 * request using the user's mnemonic.
 *
 * @param {string} user - User ID or Pine address of the user making the request.
 * @param {string} path - HTTP path of the request to sign, e.g. `/v1/users`.
 * @param {string} rawBody - The request body as it will be sent, e.g. as JSON.
 * @param {object} keyPair - A bitcoinjs key pair to sign the request with.
 *
 * @returns {string} An HTTP Authorization header with user credentials.
 */
const getAuthorizationHeader = (user, path, rawBody, keyPair) => {
  const message = path + rawBody;
  const signature = sign(message, keyPair);
  const credentials = Buffer.from(`${user}:${signature}`).toString('base64');

  return `Basic ${credentials}`;
};

export default getAuthorizationHeader;
