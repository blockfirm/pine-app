import { fetchWithTimeout } from '../../../network';
import { resolveBaseUrl } from '../address';

const REQUEST_TIMEOUT = 5000; // 5 seconds.

/**
 * Gets information about a Pine server.
 *
 * @param {string} hostname - Hostname of Pine server to get info about.
 *
 * @returns {Promise} A promise that resolves to the returned info.
 */
const get = (hostname) => {
  const baseUrl = resolveBaseUrl(hostname);
  const url = `${baseUrl}/v1/info`;

  return fetchWithTimeout(url, undefined, REQUEST_TIMEOUT)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return response.json().then((error) => {
        throw new Error(error.message);
      });
    })
    .catch((error) => {
      if (error.name === 'SyntaxError') {
        throw new Error('Received an invalid response when trying to get server info');
      }

      throw error;
    });
};

export default get;
