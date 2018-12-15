import { NOTIFICATIONS_SET_PERMISSIONS } from '../../actions/notifications/setPermissions';

const permissions = (state = {}, action) => {
  switch (action.type) {
    case NOTIFICATIONS_SET_PERMISSIONS:
      return {
        ...action.permissions
      };

    default:
      return state;
  }
};

export default permissions;
