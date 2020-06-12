let lightningClient = null;

export { default as LightningClient } from './LightningClient';
export { default as waitForLightningClient } from './waitForLightningClient';

export const getClient = () => lightningClient;

export const setClient = (client) => {
  lightningClient = client;
};
