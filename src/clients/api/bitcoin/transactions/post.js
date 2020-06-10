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
      if (response.error !== undefined) {
        throw new Error(response.error);
      }

      if (!response.txid) {
        throw new SyntaxError();
      }

      return response;
    })
    .catch((error) => {
      if (error.name === 'SyntaxError') {
        throw new Error(
          'Received an invalid response when trying to post transaction'
        );
      }

      throw error;
    });
};

export default post;
