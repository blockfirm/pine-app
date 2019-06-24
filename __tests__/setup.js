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
