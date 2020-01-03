import { NativeModules } from 'react-native';
import LOCALE from './locale';

const FORCE_12_HOUR_TIME = NativeModules.SettingsManager.settings.AppleICUForce12HourTime || false;
const FORCE_24_HOUR_TIME = NativeModules.SettingsManager.settings.AppleICUForce24HourTime || false;

const formatTime = (date) => {
  const formatOptions = {
    hour: 'numeric',
    minute: '2-digit'
  };

  if (FORCE_12_HOUR_TIME) {
    formatOptions.hour = 'numeric';
    formatOptions.hour12 = true;
  }

  if (FORCE_24_HOUR_TIME) {
    formatOptions.hour = '2-digit';
    formatOptions.hour12 = false;
  }

  return date.toLocaleTimeString(LOCALE, formatOptions);
};

export default formatTime;
