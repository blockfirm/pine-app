import { NOTIFICATIONS_ON_REGISTER } from '../../actions/notifications/onRegister';

const deviceToken = (state = null, action) => {
  switch (action.type) {
    case NOTIFICATIONS_ON_REGISTER:
      return action.deviceToken;

    default:
      return state;
  }
};

export default deviceToken;
