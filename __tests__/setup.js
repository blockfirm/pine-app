jest.mock('Settings', () => ({
  get: jest.fn(() => ({})),
  set: jest.fn(() => {})
}));

jest.mock('../src/config');
