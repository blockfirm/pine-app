/**
 * Extracts a Pine address from a BIP21 URI.
 *
 * @param {string} uri - BIP21 URI.
 *
 * @returns {string} A Pine address if found in URI, else `null`.
 */
const getAddressFromUri = (uri) => {
  const lowercaseUri = uri.toLowerCase().trim();

  if (lowercaseUri.search(/^bitcoin/i) !== 0) {
    return null;
  }

  const matches = lowercaseUri.match(/pine=(.+@[^&]+)/i);

  if (matches) {
    return matches[1].trim();
  }

  return null;
};

export default getAddressFromUri;
