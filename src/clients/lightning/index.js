let lightningClient = null;

export { default as LightningClient } from './LightningClient';

export const getClient = () => lightningClient;

export const setClient = (client) => {
  lightningClient = client;
};
