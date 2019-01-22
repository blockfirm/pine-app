import getRegionLocale from './getRegionLocale';

const regionLocale = getRegionLocale();

const formatNumber = (number) => {
  const formatOptions = {
    style: 'decimal',
    maximumFractionDigits: 20
  };

  return new Intl.NumberFormat(regionLocale, formatOptions).format(number);
};

export default formatNumber;
