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
      if (response.error !== undefined || !response.hasOwnProperty('satoshisPerByte')) {
        throw new Error(response.error || 'Unknown error when estimating transaction fee.');
      }

      return response.satoshisPerByte;
    });
};

export default get;
