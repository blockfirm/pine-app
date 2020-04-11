import { fetchWithTimeout } from '../../../network';
import { parse as parseAddress, resolveBaseUrl } from '../address';

const REQUEST_TIMEOUT = 5000; // 5 seconds.

/**
 * Gets a user by its Pine address.
 *
 * @param {string} pineAddress - Pine address of the user to get.
 *
 * @returns {Promise} A promise that resolves to the user.
 */
const get = (pineAddress) => {
  const { username, hostname } = parseAddress(pineAddress);
  const usernameParam = encodeURIComponent(username);
  const baseUrl = resolveBaseUrl(hostname);
  const url = `${baseUrl}/v1/users?username=${usernameParam}`;

  return fetchWithTimeout(url, undefined, REQUEST_TIMEOUT)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return response.json().then((error) => {
        throw new Error(error.message);
      });
    })
    .then((response) => {
      if (!Array.isArray(response)) {
        throw new SyntaxError();
      }

      const user = response[0];

      if (!user || !user.id || user.username !== username) {
        throw new SyntaxError();
      }

      return user;
    })
    .catch((error) => {
      if (error.name === 'SyntaxError') {
        throw new Error('Received an invalid response when trying to get user');
      }

      throw error;
    });
};

export default get;
