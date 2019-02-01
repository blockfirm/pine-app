const VALID_USERNAME_REGEXP = new RegExp('^[a-z0-9\\._]+$');
const USERNAME_MAX_LENGTH = 20;

export class UsernameEmptyError extends Error {}
export class UsernameTooLongError extends Error {}
export class UsernameContainsInvalidCharsError extends Error {}

/**
 * Validates a username of a Pine Address.
 *
 * A valid username is:
 *
 * - Minimum 1 character
 * - Maximum 20 characters
 * - Only contains alphanumeric characters (lowercase a-z, 0-9), underscores (_), and periods (.)
 *
 * (Keep in mind that each server can impose their own rules.)
 *
 * @param {string} username - The username to validate.
 *
 * @returns {boolean} True if the username is valid, otherwise it throws an error.
 */
const validateUsername = (username) => {
  if (!username) {
    throw new UsernameEmptyError('The username cannot be empty');
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    throw new UsernameTooLongError('The username is too long');
  }

  if (!VALID_USERNAME_REGEXP.test(username)) {
    throw new UsernameContainsInvalidCharsError('The username contains invalid characters');
  }

  return true;
};

export default validateUsername;
