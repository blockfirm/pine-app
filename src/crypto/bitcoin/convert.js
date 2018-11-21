export const UNIT_BTC = 'BTC';
export const UNIT_MBTC = 'mBTC';
export const UNIT_SATOSHIS = 'Satoshis';

const convertToBtc = (amount, fromUnit) => {
  if (!amount) {
    return 0;
  }

  switch (fromUnit) {
    case UNIT_BTC:
      return amount;

    case UNIT_MBTC:
      return amount / 1000;

    case UNIT_SATOSHIS:
      return amount / 100000000;
  }
};

/**
 * Converts a bitcoin amount from one unit to another.
 *
 * @param {number} amount - Amount to convert.
 * @param {string} fromUnit - Unit that the amount is specified in. BTC, mBTC, or Satoshis.
 * @param {string} toUnit - Unit to convert the amount to. BTC, mBTC, or Satoshis.
 *
 * @returns number The converted amount.
 */
export const convert = (amount, fromUnit, toUnit) => {
  const btc = convertToBtc(amount, fromUnit);

  if (!btc) {
    return 0;
  }

  switch (toUnit) {
    case UNIT_BTC:
      return btc;

    case UNIT_MBTC:
      return btc * 1000;

    case UNIT_SATOSHIS:
      return btc * 100000000;
  }
};
