import { NativeModules } from 'react-native';

jest.mock('Settings', () => ({
  get: jest.fn(() => ({})),
  set: jest.fn(() => {})
}));

jest.mock('AccessibilityInfo', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  isReduceTransparencyEnabled: jest.fn(() => Promise.resolve(false))
}));

jest.mock('../src/config');

NativeModules.SettingsManager = {
  settings: {
    AppleLocale: 'en_US'
  }
};
