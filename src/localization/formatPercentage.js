import REGION_LOCALE from './regionLocale';

const formatPercentage = (percentage) => {
  const maximumFractionDigits = percentage < 1 ? 2 : 0;

  const formatOptions = {
    style: 'percent',
    maximumFractionDigits
  };

  return new Intl.NumberFormat(REGION_LOCALE, formatOptions).format(percentage / 100);
};

export default formatPercentage;
