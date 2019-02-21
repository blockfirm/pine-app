import { sign } from '../crypto';

const getAuthorizationHeader = (user, path, rawBody, keyPair) => {
  const message = path + rawBody;
  const signature = sign(message, keyPair);
  const credentials = Buffer.from(`${user}:${signature}`).toString('base64');

  return `Basic ${credentials}`;
};

export default getAuthorizationHeader;
