import REGION_LOCALE from './regionLocale';

const formatNumber = (number) => {
  const formatOptions = {
    style: 'decimal',
    maximumFractionDigits: 20
  };

  return new Intl.NumberFormat(REGION_LOCALE, formatOptions).format(number);
};

export default formatNumber;
