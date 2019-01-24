import fiatCurrencies from './currencies/fiatCurrencies';
import regionToCurrencyMap from './currencies/regionToCurrencyMap';
import REGION_LOCALE from './regionLocale';

const DEFAULT_CURRENCY = 'USD';

const getRegionCurrency = () => {
  const regionCurrency = regionToCurrencyMap[REGION_LOCALE] || DEFAULT_CURRENCY;

  if (fiatCurrencies.includes(regionCurrency)) {
    return regionCurrency;
  }

  return DEFAULT_CURRENCY;
};

export default getRegionCurrency();
