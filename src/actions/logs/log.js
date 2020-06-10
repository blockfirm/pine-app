export const LOGS_LOG = 'LOGS_LOG';

export const log = (title, details = {}) => ({
  type: LOGS_LOG,
  title,
  details
});
