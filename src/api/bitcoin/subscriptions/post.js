/**
 * Subscribes to push notifications about incoming transactions.
 *
 * @param {string} deviceToken - iOS device token to send notifications to.
 * @param {array} addresses - Bitcoin addresses to listen for.
 * @param {object} options - Object containing the property 'baseUrl'.
 */
const post = (deviceToken, addresses, options) => {
  const url = `${options.baseUrl}/bitcoin/subscriptions`;

  const body = {
    deviceToken,
    addresses
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
        throw new Error(response.error || 'Unknown error when creating subscription.');
      }

      return response;
    });
};

export default post;
