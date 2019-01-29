const VALID_USERNAME_REGEXP = new RegExp('^[a-z0-9\\._]+$');
const USERNAME_LENGTH_LIMIT = 30;

/**
 * Validates a username of a Pine Address.
 *
 * A valid username is:
 *
 * - Minimum 1 character
 * - Maximum 30 characters
 * - Only contains alphanumeric characters (lowercase a-z, 0-9), underscores (_), and periods (.)
 *
 * @param {string} username - The username to validate.
 *
 * @returns {boolean} True if the username is valid, otherwise it throws an error.
 */
const validateUsername = (username) => {
  if (!username) {
    throw new Error('The username cannot be empty');
  }

  if (username.length > USERNAME_LENGTH_LIMIT) {
    throw new Error('The username is too long');
  }

  if (!VALID_USERNAME_REGEXP.test(username)) {
    throw new Error('The username is invalid');
  }

  return true;
};

export default validateUsername;
