export const NOTIFICATIONS_ON_REGISTER_ERROR = 'NOTIFICATIONS_ON_REGISTER_ERROR';

/**
 * Action that is triggered when the app failed to register for notifications.
 */
export const onRegisterError = (error) => {
  return {
    type: NOTIFICATIONS_ON_REGISTER_ERROR,
    error
  };
};
