const AZTECO_URL = 'https://azte.co';

/**
 * Determines whether the passed string is an Azteco URL.
 *
 * @param {string} url - A string to check.
 *
 * @returns {boolean} true if the string is an Azteco URL, otherwise false.
 */
const isAztecoUrl = (url) => {
  return url.startsWith(AZTECO_URL);
};

export default isAztecoUrl;
