const FAKE_MNEMONIC = 'during bulb nominee acquire paddle next course stable govern eagle title wing';

export default {
  getItem: jest.fn(() => {
    return Promise.resolve(FAKE_MNEMONIC);
  }),
  setItem: jest.fn(() => {
    return Promise.resolve();
  }),
  removeItem: jest.fn(() => {
    return Promise.resolve();
  })
};
