import { NativeModules } from 'react-native';

jest.mock('Settings', () => ({
  get: jest.fn(() => ({})),
  set: jest.fn(() => {})
}));

jest.mock('../src/config');

NativeModules.SettingsManager = {
  settings: {
    AppleLocale: 'en_US'
  }
};

// Polyfill Array.prototype.flat() (deep).
Array.prototype.flat = function flattenDeep() {
  return this.reduce((flattened, item) => {
    return Array.isArray(item) ? flattened.concat(item.flat()) : flattened.concat(item);
  }, []);
};
