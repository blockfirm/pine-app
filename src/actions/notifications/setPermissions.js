export const NOTIFICATIONS_SET_PERMISSIONS = 'NOTIFICATIONS_SET_PERMISSIONS';

/**
 * Action to set the current notification permissions to state.
 */
export const setPermissions = (permissions) => {
  return {
    type: NOTIFICATIONS_SET_PERMISSIONS,
    permissions
  };
};
