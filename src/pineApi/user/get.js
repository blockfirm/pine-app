import { parse as parseAddress, resolveBaseUrl } from '../address';

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

  return fetch(url)
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
        throw new Error('Unknown error when getting user');
      }

      const user = response[0];

      if (!user || !user.id || user.username !== username) {
        throw new Error('Unknown error when getting user');
      }

      return user;
    });
};

export default get;
