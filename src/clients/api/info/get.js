/**
 * Gets information about the API server and its node.
 *
 * @param {object} options - Object containing the property 'baseUrl'.
 */
const get = (options) => {
  const url = `${options.baseUrl}/v1/info`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.error !== undefined) {
        throw new Error(response.error);
      }

      return response;
    })
    .catch((error) => {
      if (error.name === 'SyntaxError') {
        throw new Error(
          'Received an invalid response when trying to get server info'
        );
      }

      throw error;
    });
};

export default get;
