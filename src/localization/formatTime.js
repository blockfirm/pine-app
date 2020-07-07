import { NativeModules } from 'react-native';
import LOCALE from './locale';

const FORCE_12_HOUR_TIME = NativeModules.SettingsManager.settings.AppleICUForce12HourTime || false;
const FORCE_24_HOUR_TIME = NativeModules.SettingsManager.settings.AppleICUForce24HourTime || false;

const NUMERIC = 'numeric';
const TWO_DIGIT = '2-digit';

const getDefaultFormatOptions = () => {
  const formattedTime = new Date('1 Jan 2020 01:01').toLocaleTimeString(LOCALE);
  let delimiter = ':';

  if (formattedTime.indexOf(':') > -1) {
    delimiter = ':';
  } else if (formattedTime.indexOf('.') > -1) {
    delimiter = '.';
  } else {
    return { hour: TWO_DIGIT, minute: TWO_DIGIT };
  }

  const timeParts = formattedTime.split(delimiter);
  const hour = timeParts[0];
  const minute = timeParts[1];

  return {
    hour: hour.length === 2 ? TWO_DIGIT : NUMERIC,
    minute: minute.length === 2 ? TWO_DIGIT : NUMERIC
  };
};

const DEFAULT_FORMAT_OPTIONS = getDefaultFormatOptions();

const formatTime = (date) => {
  const formatOptions = { ...DEFAULT_FORMAT_OPTIONS };

  if (FORCE_12_HOUR_TIME) {
    formatOptions.hour = NUMERIC;
    formatOptions.hour12 = true;
  }

  if (FORCE_24_HOUR_TIME) {
    formatOptions.hour = TWO_DIGIT;
    formatOptions.hour12 = false;
  }

  return date.toLocaleTimeString(LOCALE, formatOptions);
};

export default formatTime;
