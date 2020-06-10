/**
 * Gets a bitcoin transaction by txid from the API.
 *
 * @param {string} txid - Hash of transaction to get.
 * @param {object} options - Object containing the property 'baseUrl'.
 */
const getByTxid = (txid, options) => {
  const url = `${options.baseUrl}/v1/bitcoin/transactions/${txid}`;

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
          'Received an invalid response when trying to get transaction'
        );
      }

      throw error;
    });
};

export default getByTxid;
