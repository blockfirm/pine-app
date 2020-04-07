import {
  CONTACTS_SYNC_SUCCESS,
  CONTACTS_SYNC_FAILURE
} from '../../actions/contacts/sync';

const pine = (state = {}, action) => {
  switch (action.type) {
    case CONTACTS_SYNC_SUCCESS:
      return {
        ...state,
        disconnected: false
      };

    case CONTACTS_SYNC_FAILURE:
      return {
        ...state,
        disconnected: true
      };

    default:
      return state;
  }
};

export default pine;
