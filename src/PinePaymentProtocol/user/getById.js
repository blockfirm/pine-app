import { resolveBaseUrl } from '../address';

const getById = (id, hostname) => {
  const baseUrl = resolveBaseUrl(hostname);
  const url = `${baseUrl}/v1/users/${id}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.id !== id) {
        throw new Error(response.error || 'Unknown error when getting user');
      }

      return response;
    });
};

export default getById;
