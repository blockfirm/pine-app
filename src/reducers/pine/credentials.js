import { PINE_CREDENTIALS_LOAD_SUCCESS } from '../../actions/pine/credentials';
import { RESET_SUCCESS } from '../../actions';

const credentials = (state = null, action) => {
  switch (action.type) {
    case PINE_CREDENTIALS_LOAD_SUCCESS:
      return action.credentials;

    case RESET_SUCCESS:
      return null;

    default:
      return state;
  }
};

export default credentials;
