export default {
  addEventListener: jest.fn(() => {
    return jest.fn();
  }),
  removeEventListener: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
  getInitialNotification: jest.fn(() => {
    return Promise.resolve();
  }),
  requestPermissions: jest.fn(() => {
    return Promise.resolve({});
  })
};
