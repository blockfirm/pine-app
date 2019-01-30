const VALID_HOSTNAME_REGEXP = new RegExp('^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9])$');
const HOSTNAME_MAX_LENGTH = 50;

export class HostnameEmptyError extends Error {}
export class HostnameTooLongError extends Error {}
export class HostnameContainsInvalidCharsError extends Error {}

/**
 * Validates a hostname of a Pine Address.
 *
 * A valid hostname is:
 *
 * - Minimum 1 character
 * - Maximum 50 characters
 * - Only contains alphanumeric characters (A-Z, 0-9), dashes (-), and periods (.)
 *
 * @param {string} hostname - The hostname to validate.
 *
 * @returns {boolean} True if the hostname is valid, otherwise it throws an error.
 */
const validateHostname = (hostname) => {
  if (!hostname) {
    throw new HostnameEmptyError('The hostname cannot be empty');
  }

  if (hostname.length > HOSTNAME_MAX_LENGTH) {
    throw new HostnameTooLongError('The hostname is too long');
  }

  if (!VALID_HOSTNAME_REGEXP.test(hostname)) {
    throw new HostnameContainsInvalidCharsError('The hostname contains invalid characters');
  }

  return true;
};

export default validateHostname;
