import { PINE_CREDENTIALS_LOAD_SUCCESS } from '../../actions/pine/credentials';

const credentials = (state = null, action) => {
  switch (action.type) {
    case PINE_CREDENTIALS_LOAD_SUCCESS:
      return action.credentials;

    default:
      return state;
  }
};

export default credentials;
