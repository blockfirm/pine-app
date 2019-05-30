/**
 * Normalizes a number to a valid BTC amount with the correct precision.
 *
 * @param {number} amount - Amount to normalize.
 *
 * @returns number The normalized amount.
 */
const normalizeBtcAmount = (amount) => {
  if (!amount) {
    return 0;
  }

  return Number(amount.toFixed(8));
};

export default normalizeBtcAmount;
