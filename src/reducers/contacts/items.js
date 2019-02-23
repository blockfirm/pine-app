import * as contactsActions from '../../actions/contacts';

const items = (state = {}, action) => {
  let newState;
  let contact;

  switch (action.type) {
    case contactsActions.CONTACTS_LOAD_SUCCESS:
      return action.contacts;

    case contactsActions.CONTACTS_ADD_SUCCESS:
      contact = { ...action.contact };

      return {
        ...state,
        [action.contact.id]: contact
      };

    case contactsActions.CONTACTS_REMOVE_SUCCESS:
      newState = { ...state };
      delete newState[action.contact.id];
      return newState;

    case contactsActions.CONTACTS_REMOVE_ALL_SUCCESS:
      return {};

    case contactsActions.CONTACTS_SYNC_CONTACT_REQUESTS_SUCCESS:
      return action.contacts;

    default:
      return state;
  }
};

export default items;
