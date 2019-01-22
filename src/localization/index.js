import getDecimalSeparator from './getDecimalSeparator';
import getThousandsSeparator from './getThousandsSeparator';

export { default as getLocale } from './getLocale';
export { default as getRegionLocale } from './getRegionLocale';
export { default as formatNumber } from './formatNumber';
export { getDecimalSeparator, getThousandsSeparator };

export const DECIMAL_SEPARATOR = getDecimalSeparator();
export const THOUSANDS_SEPARATOR = getThousandsSeparator();
