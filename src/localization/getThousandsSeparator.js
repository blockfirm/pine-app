import formatNumber from './formatNumber';

const thousandsSeparator = formatNumber('1000')[1];

const getThousandsSeparator = () => {
  return thousandsSeparator;
};

export default getThousandsSeparator;
