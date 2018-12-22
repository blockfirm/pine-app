/**
 * Deletes all subscriptions the device token is subscribed to for push notifications.
 *
 * @param {string} deviceToken - Device token to unsubscribe.
 * @param {object} options - Object containing the property 'baseUrl'.
 */
const deleteByDeviceToken = (deviceToken, options) => {
  const url = `${options.baseUrl}/bitcoin/subscriptions/${deviceToken}`;

  const fetchOptions = {
    method: 'DELETE'
  };

  return fetch(url, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.error !== undefined) {
        throw new Error(response.error || 'Unknown error when deleting subscription.');
      }

      return response;
    });
};

export default deleteByDeviceToken;
