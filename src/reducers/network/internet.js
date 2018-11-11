import { NETWORK_INTERNET_DISCONNECTED, NETWORK_INTERNET_CONNECTED } from '../../actions/network/internet';

const internet = (state = {}, action) => {
  switch (action.type) {
    case NETWORK_INTERNET_CONNECTED:
      return {
        ...state,
        disconnected: false
      };

    case NETWORK_INTERNET_DISCONNECTED:
      return {
        ...state,
        disconnected: true
      };

    default:
      return state;
  }
};

export default internet;
