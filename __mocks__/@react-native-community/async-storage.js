export default {
  getItem: jest.fn(() => {
    return Promise.resolve('{}');
  }),
  setItem: jest.fn(() => {
    return Promise.resolve();
  }),
  removeItem: jest.fn(() => {
    return Promise.resolve();
  })
};
