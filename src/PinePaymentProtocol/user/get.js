import { parse as parseAddress, resolveBaseUrl } from '../address';

const get = (pineAddress) => {
  const { username, hostname } = parseAddress(pineAddress);
  const baseUrl = resolveBaseUrl(hostname);
  const url = `${baseUrl}/v1/users/${username}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.username !== username) {
        throw new Error(response.error || 'Unknown error when getting user');
      }

      return response;
    });
};

export default get;
