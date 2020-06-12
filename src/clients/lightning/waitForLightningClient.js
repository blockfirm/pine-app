import { getClient } from './index';

const RETRY_DELAY = 250; // Milliseconds

/**
 * Waits for the lightning node to get ready.
 *
 * @param {number} maxWait - For how long to wait for before timing out (milliseconds)
 *
 * @returns {Promise} A promise that resolves when node is ready or rejects when it times out.
 */
const waitForLightningClient = async (maxWait) => {
  const lightningClient = getClient();

  if (lightningClient && !lightningClient.disconnected && lightningClient.ready) {
    return;
  }

  if (maxWait < RETRY_DELAY) {
    throw new Error('Timed out waiting for Lightning node to get ready');
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      waitForLightningClient(maxWait - RETRY_DELAY)
        .then(resolve)
        .catch(reject);
    }, RETRY_DELAY);
  });
};

export default waitForLightningClient;
