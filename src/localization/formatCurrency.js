import FIAT_CURRENCY_SYMBOLS from './currencies/fiatSymbols';
import DECIMAL_SEPARATOR from './decimalSeparator';
import REGION_LOCALE from './regionLocale';

const addSymbol = (amount, currency) => {
  const symbol = FIAT_CURRENCY_SYMBOLS[currency];

  if (!symbol) {
    return `${amount} ${currency}`;
  }

  if (symbol.prefix) {
    return `${symbol.prefix}${amount}`;
  }

  if (symbol.suffix) {
    return `${amount}${symbol.suffix}`;
  }
};

const formatCurrency = (amount, currency) => {
  if (amount === null) {
    return `- ${currency}`;
  }

  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  const formatOptions = {
    style: 'currency',
    currencyDisplay: 'code',
    currency
  };

  let formattedAmount = new Intl.NumberFormat(REGION_LOCALE, formatOptions).format(absoluteAmount);

  // Remove the currency code - it will be added at the end (some locales will add it as a prefix).
  formattedAmount = formattedAmount.replace(currency, '').trim();

  // Remove decimals when they're all zeros, e.g. '.00'.
  formattedAmount = formattedAmount.replace(new RegExp(`\\${DECIMAL_SEPARATOR}[0]+$`), '');

  // Add currency symbol (e.g. $, €, kr, etc.).
  formattedAmount = addSymbol(formattedAmount, currency);

  if (isNegative) {
    return `-${formattedAmount}`;
  }

  return formattedAmount;
};

export default formatCurrency;
