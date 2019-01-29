import validateUsername from './validateUsername';
import validateHostname from './validateHostname';

/**
 * Parses a Pine Payment Address.
 *
 * @param {string} pineAddress - Pine Address to parse.
 *
 * @returns {Object} An object containing `username` and `hostname` from the parsed address.
 */
const parse = (pineAddress) => {
  if (!pineAddress || typeof pineAddress !== 'string') {
    throw new Error('The address must be a non-empty string');
  }

  const parts = pineAddress.split('@');

  if (parts.length !== 2) {
    throw new Error('The address has an invalid format');
  }

  const username = parts[0].trim().toLowerCase();
  const hostname = parts[1].trim().toLowerCase();

  validateUsername(username);
  validateHostname(hostname);

  return { username, hostname };
};

export default parse;
