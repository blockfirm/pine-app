// eslint-disable-next-line max-params
const get = (addresses, page, pageSize, reverse, options) => {
  const addressesParam = encodeURIComponent(addresses.join(','));
  const reverseParam = reverse ? '1' : '0';
  const url = `${options.baseUrl}/v1/bitcoin/transactions?addresses=${addressesParam}&page=${page}&page_size=${pageSize}&reverse=${reverseParam}`;

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
          'Received an invalid response when trying to get transactions'
        );
      }

      throw error;
    });
};

export default get;
