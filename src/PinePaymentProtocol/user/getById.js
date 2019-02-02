import { resolveBaseUrl } from '../address';

const getById = (id, hostname) => {
  const baseUrl = resolveBaseUrl(hostname);
  const url = `${baseUrl}/v1/users/${id}`;

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
      if (response.id !== id) {
        throw new Error('Unknown error when getting user');
      }

      return response;
    });
};

export default getById;
