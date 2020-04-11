/**
 * Gets fiat exchange rates from the API.
 *
 * @param {array} currencies - Array of ISO 4217 codes.
 * @param {object} options - Object containing the property 'baseUrl'.
 */
const get = (currencies, options) => {
  const currenciesParam = encodeURIComponent(currencies.join(','));
  const url = `${options.baseUrl}/v1/bitcoin/fiatrates?currencies=${currenciesParam}`;

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
          'Received an invalid response when trying to get fiat exchange rates'
        );
      }

      throw error;
    });
};

export default get;
