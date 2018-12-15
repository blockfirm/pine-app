export const NOTIFICATIONS_ON_REGISTER = 'NOTIFICATIONS_ON_REGISTER';

/**
 * Action that is triggered when the app is registered for notifications.
 */
export const onRegister = (deviceToken) => {
  return {
    type: NOTIFICATIONS_ON_REGISTER,
    deviceToken
  };
};
