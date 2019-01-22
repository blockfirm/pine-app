jest.mock('Settings', () => ({
  get: jest.fn(() => ({})),
  set: jest.fn(() => {})
}));

jest.mock('../src/config');

jest.mock('../src/localization/getLocale', () => {
  return () => 'en_US';
});
