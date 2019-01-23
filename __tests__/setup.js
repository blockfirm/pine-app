jest.mock('Settings', () => ({
  get: jest.fn(() => ({})),
  set: jest.fn(() => {})
}));

jest.mock('../src/config');
jest.mock('../src/localization/locale', () => 'en_US');
