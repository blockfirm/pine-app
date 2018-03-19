export const ERROR_HANDLE = 'ERROR_HANDLE';

export const handle = (error) => ({
  type: ERROR_HANDLE,
  error
});
