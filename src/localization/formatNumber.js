import REGION_LOCALE from './regionLocale';

/**
 * Hardcode English as language because that's the only
 * language supported at the moment.
 */
const LANGUAGE_LOCALE = 'en';
const LOCALE = `${LANGUAGE_LOCALE}-${REGION_LOCALE}`;

const formatNumber = (number) => {
  const formatOptions = {
    style: 'decimal',
    maximumFractionDigits: 20
  };

  return new Intl.NumberFormat(LOCALE, formatOptions).format(number);
};

export default formatNumber;
