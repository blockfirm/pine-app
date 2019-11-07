import vendors from './vendors';

const get = (vendorId) => {
  if (!vendorId || !vendors[vendorId]) {
    return {};
  }

  return vendors[vendorId];
};

export default get;
