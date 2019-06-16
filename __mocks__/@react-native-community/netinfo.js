export default {
  addEventListener: jest.fn(() => {
    return jest.fn();
  }),
  fetch: jest.fn(() => {
    return Promise.resolve({ isConnected: true });
  })
};
