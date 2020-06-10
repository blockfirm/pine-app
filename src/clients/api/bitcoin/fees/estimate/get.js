/**
 * Gets a transaction fee estimate from the API.
 *
 * @param {number} numberOfBlocks - Number of blocks until confirmation. Defaults to 1.
 * @param {object} options - Object containing the property 'baseUrl'.
 */
const get = (numberOfBlocks, options) => {
  const numberOfBlocksParam = Number(numberOfBlocks) || 1;
  const url = `${options.baseUrl}/v1/bitcoin/fees/estimate?numberOfBlocks=${numberOfBlocksParam}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.error !== undefined) {
        throw new Error(response.error);
      }

      if (!response.hasOwnProperty('satoshisPerByte')) {
        throw new SyntaxError();
      }

      return response.satoshisPerByte;
    })
    .catch((error) => {
      if (error.name === 'SyntaxError') {
        throw new Error(
          'Received an invalid response when trying to estimate transaction fee'
        );
      }

      throw error;
    });
};

export default get;
