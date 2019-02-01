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

      const user = response[0];

      if (!user || !user.id || user.username !== username) {
        throw new Error('Unknown error when getting user');
      }

      return user;
    });
};

export default get;
