import { NativeModules } from 'react-native';

const AppleLocale = NativeModules.SettingsManager.settings.AppleLocale || 'en_US';

const LOCALE = AppleLocale
  .replace('_', '-')
  .replace(/@.*/, '');

export default LOCALE;
