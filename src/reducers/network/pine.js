import {
  PINE_CONTACT_REQUESTS_GET_SUCCESS,
  PINE_CONTACT_REQUESTS_GET_FAILURE
} from '../../actions/paymentServer/contactRequests/get';

const pine = (state = {}, action) => {
  switch (action.type) {
    case PINE_CONTACT_REQUESTS_GET_SUCCESS:
      return {
        ...state,
        disconnected: false
      };

    case PINE_CONTACT_REQUESTS_GET_FAILURE:
      return {
        ...state,
        disconnected: true
      };

    default:
      return state;
  }
};

export default pine;
