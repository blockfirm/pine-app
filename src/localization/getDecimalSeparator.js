import formatNumber from './formatNumber';

const decimalSeparator = formatNumber('1.1')[1];

const getDecimalSeparator = () => {
  return decimalSeparator;
};

export default getDecimalSeparator;
