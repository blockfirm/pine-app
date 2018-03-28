export const FAKE_USERNAME = '';
export const FAKE_PASSWORD = 'during bulb nominee acquire paddle next course stable govern eagle title wing';

export const getGenericPassword = jest.fn(() => {
  return Promise.resolve({
    username: FAKE_USERNAME,
    password: FAKE_PASSWORD
  });
});

export const setGenericPassword = jest.fn(() => {
  return Promise.resolve();
});

export const resetGenericPassword = jest.fn(() => {
  return Promise.resolve();
});
