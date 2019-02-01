import { parse as parseAddress, resolveBaseUrl } from '../address';

const get = (pineAddress) => {
  const { username, hostname } = parseAddress(pineAddress);
  const usernameParam = encodeURIComponent(username);
  const baseUrl = resolveBaseUrl(hostname);
  const url = `${baseUrl}/v1/users?username=${usernameParam}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (!Array.isArray(response)) {
        throw new Error(response.error || 'Unknown error when getting user');
      }

      if (!response[0] || !response[0].id || response[0].username !== username) {
        throw new Error('Unknown error when getting user');
      }

      return response[0];
    });
};

export default get;
