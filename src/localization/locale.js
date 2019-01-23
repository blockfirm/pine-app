import { NativeModules } from 'react-native';

const LOCALE = NativeModules.SettingsManager.settings.AppleLocale;

export default LOCALE;
