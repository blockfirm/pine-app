import * as logActions from '../actions/logs';

const sanitize = (action) => {
  const sanitized = { ...action };

  if (sanitized.credentials) {
    sanitized.credentials = '<redacted>';
  }

  if (action.type.includes('LOAD_SUCCESS')) {
    return '<redacted>';
  }

  if (sanitized.error) {
    sanitized.error = sanitized.error.toString();
  }

  return sanitized;
};

/**
 * This is a redux middleware that logs all actions to state.
 * It does not persist the logs anywhere and they never leave
 * the device. This is only used for beta releases.
 */
const loggingMiddleware = () => {
  return store => next => action => {
    const state = store.getState();
    const { settings } = state;

    if (!settings || !settings.logging || !settings.logging.enabled) {
      return next(action);
    }

    if (action.type === logActions.LOGS_LOG) {
      return next(action);
    }

    store.dispatch(logActions.log(
      action.type,
      sanitize(action)
    ));

    return next(action);
  };
};

export default loggingMiddleware();
