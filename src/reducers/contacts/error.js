import * as contactsActions from '../../actions/contacts';

const error = (state = null, action) => {
  switch (action.type) {
    case contactsActions.CONTACTS_ADD_REQUEST:
    case contactsActions.CONTACTS_LOAD_REQUEST:
    case contactsActions.CONTACTS_REMOVE_REQUEST:
    case contactsActions.CONTACTS_SAVE_REQUEST:
      return null;

    case contactsActions.CONTACTS_LOAD_FAILURE:
    case contactsActions.CONTACTS_REMOVE_FAILURE:
    case contactsActions.CONTACTS_SAVE_FAILURE:
      return action.error;

    default:
      return state;
  }
};

export default error;
