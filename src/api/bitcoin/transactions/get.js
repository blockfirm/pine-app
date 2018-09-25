// eslint-disable-next-line max-params
const get = (addresses, page, pageSize, reverse, options) => {
  const addressesParam = encodeURIComponent(addresses.join(','));
  const reverseParam = reverse ? '1' : '0';
  const url = `${options.baseUrl}/bitcoin/transactions?addresses=${addressesParam}&page=${page}&page_size=${pageSize}&reverse=${reverseParam}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.error !== undefined) {
        throw new Error(response.error || 'Unknown error when getting transactions.');
      }

      return response;
    });
};

export default get;
