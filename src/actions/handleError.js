export const HANDLE_ERROR = 'HANDLE_ERROR';

export const handleError = (error) => ({
  type: HANDLE_ERROR,
  error
});
