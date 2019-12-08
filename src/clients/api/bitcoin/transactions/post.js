const post = (rawTransaction, options) => {
  const url = `${options.baseUrl}/v1/bitcoin/transactions`;

  const body = {
    transaction: rawTransaction
  };

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };

  return fetch(url, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (!response.txid) {
        throw new Error(response.error || 'Unknown error when posting transaction.');
      }

      return response;
    });
};

export default post;
