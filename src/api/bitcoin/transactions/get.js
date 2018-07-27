const get = (addresses, page, options) => {
  const addressesParam = encodeURIComponent(addresses.join(','));
  const url = `${options.baseUrl}/bitcoin/transactions?addresses=${addressesParam}&page=${page}`;

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
