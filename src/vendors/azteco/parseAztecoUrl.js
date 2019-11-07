/**
 * Parses an Azteco URL to get the voucher code.
 *
 * @param {string} url - An Azteco URL to parse.
 *
 * @returns {string[]} An Azteco voucher code as a string array.
 */
const parseAztecoUrl = (url) => {
  const params = url.match(/(c[1-4])=([0-9]+)/gi);
  const codes = params.map(param => param.split('=')[1]);

  return codes;
};

export default parseAztecoUrl;
