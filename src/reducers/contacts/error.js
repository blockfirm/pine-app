import * as contactsActions from '../../actions/contacts';
import * as contactRequestsActions from '../../actions/contacts/contactRequests';

const error = (state = null, action) => {
  switch (action.type) {
    case contactsActions.CONTACTS_ADD_REQUEST:
    case contactsActions.CONTACTS_LOAD_REQUEST:
    case contactsActions.CONTACTS_REMOVE_REQUEST:
    case contactsActions.CONTACTS_SAVE_REQUEST:
    case contactRequestsActions.CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_REQUEST:
      return null;

    case contactsActions.CONTACTS_LOAD_FAILURE:
    case contactsActions.CONTACTS_REMOVE_FAILURE:
    case contactsActions.CONTACTS_SAVE_FAILURE:
    case contactRequestsActions.CONTACTS_CONTACT_REQUESTS_SYNC_INCOMING_FAILURE:
      return action.error;

    default:
      return state;
  }
};

export default error;
