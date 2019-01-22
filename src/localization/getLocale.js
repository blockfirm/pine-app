import { NativeModules } from 'react-native';

const locale = NativeModules.SettingsManager.settings.AppleLocale;

const getLocale = () => {
  return locale;
};

export default getLocale;
