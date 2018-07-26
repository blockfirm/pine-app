import querystring from 'querystring';

const get = (addresses, page, options) => {
  const queryParams = {
    addresses: addresses.join(','),
    page
  };

  const queryString = querystring.stringify(queryParams);
  const url = `${options.baseUrl}/bitcoin/transactions?${queryString}`;

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
