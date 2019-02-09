/**
 * Gets the number of addresses the device token is subscribed to for push notifications.
 *
 * @param {string} deviceToken - Device token to get information about.
 * @param {object} options - Object containing the property 'baseUrl'.
 */
const getByDeviceToken = (deviceToken, options) => {
  const url = `${options.baseUrl}/v1/bitcoin/subscriptions/${deviceToken}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.error !== undefined) {
        throw new Error(response.error || 'Unknown error when getting subscription info.');
      }

      return response;
    });
};

export default getByDeviceToken;
