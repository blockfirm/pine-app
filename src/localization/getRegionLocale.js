import getLocale from './getLocale';

const locale = getLocale();
const regionLocale = locale.split('_')[1];

const getRegionLocale = () => {
  return regionLocale;
};

export default getRegionLocale;
