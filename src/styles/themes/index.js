import dark from './dark';
import light from './light';

export default {
  default: light,
  dark: {
    ...light,
    ...dark
  },
  light
};
